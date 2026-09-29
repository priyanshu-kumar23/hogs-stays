const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const B = {west:76.98,east:77.5,south:32.1,north:32.6};
const zoom=11, tiles=2**zoom;
const tx=lon=>(lon+180)/360*tiles;
const ty=lat=>(1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*tiles;
async function download(url) { const r=await fetch(url); if(!r.ok)throw new Error(url+' '+r.status); return Buffer.from(await r.arrayBuffer()); }
(async()=>{
 const cache=new Map();
 const xmin=Math.floor(tx(B.west)),xmax=Math.floor(tx(B.east)),ymin=Math.floor(ty(B.north)),ymax=Math.floor(ty(B.south));
 for(let y=ymin;y<=ymax;y++) await Promise.all(Array.from({length:xmax-xmin+1},async(_,i)=>{
   const x=xmin+i; const bytes=await download('https://s3.amazonaws.com/elevation-tiles-prod/terrarium/'+zoom+'/'+x+'/'+y+'.png');
   const raw=await sharp(bytes).removeAlpha().raw().toBuffer();cache.set(x+','+y,raw);
 }));
 const pixel=(x,y)=>{const tile=cache.get(Math.floor(x/256)+','+Math.floor(y/256));const idx=((y%256)*256+x%256)*3;return tile[idx]*256+tile[idx+1]+tile[idx+2]/256-32768;};
 const sample=(lon,lat)=>{const px=tx(lon)*256,py=ty(lat)*256,x=Math.floor(px),y=Math.floor(py),u=px-x,v=py-y;return pixel(x,y)*(1-u)*(1-v)+pixel(x+1,y)*u*(1-v)+pixel(x,y+1)*(1-u)*v+pixel(x+1,y+1)*u*v;};
 const size=513, heights=Buffer.alloc(size*size*2);let min=Infinity,max=-Infinity;
 for(let j=0;j<size;j++)for(let i=0;i<size;i++){const h=Math.round(sample(B.west+(B.east-B.west)*i/(size-1),B.north-(B.north-B.south)*j/(size-1)));heights.writeUInt16LE(h,(j*size+i)*2);min=Math.min(min,h);max=Math.max(max,h);}
 await fs.writeFile('public/terrain/manali-dem.bin',heights);
 const meta={...B,size,baseElevation:1500,metresPerUnit:100,width:(B.east-B.west)*111320*Math.cos(32.35*Math.PI/180)/100,depth:(B.north-B.south)*111320/100,min,max,source:'Mapzen / Tilezen terrain tiles; SRTM data courtesy of the U.S. Geological Survey',sourceURL:'https://registry.opendata.aws/terrain-tiles/',modifications:'Cropped, bilinearly resampled to 513 by 513, integer metre quantization. No invented terrain or vertical exaggeration.'};
 await fs.writeFile('lib/terrain-data.json',JSON.stringify(meta,null,2));
 const files=await (await fetch('https://api.polyhaven.com/files/rocky_terrain')).json();
 for(const [key,out] of [['Diffuse','rock-color'],['nor_gl','rock-normal'],['Rough','rock-roughness'],['AO','rock-ao']]){
   const choice=files[key]?.['1k']?.jpg;
   if(!choice) throw new Error('Missing '+key);
   const bytes=await download(choice.url);
   await sharp(bytes).webp({quality:key==='nor_gl'?90:82}).toFile('public/textures/'+out+'.webp');
 }
 const attr=await (await fetch('https://raw.githubusercontent.com/tilezen/joerd/master/docs/attribution.md')).text();
 await fs.writeFile('public/terrain/ATTRIBUTION.md',attr);
 await fs.writeFile('public/textures/LICENSE.md','Rocky Terrain by Amal Kumar / Poly Haven. CC0. Source: https://polyhaven.com/a/rocky_terrain\nMaps resized/encoded to WebP.\n');
 console.log(meta);console.log('Manali elevation',sample(77.1887,32.2396));
})().catch(e=>{console.error(e);process.exitCode=1;});

