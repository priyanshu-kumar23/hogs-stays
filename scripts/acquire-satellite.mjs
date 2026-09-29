import fs from 'node:fs/promises';
import { fromUrl } from 'geotiff';
import proj4 from 'proj4';
import sharp from 'sharp';
const meta=JSON.parse(await fs.readFile('lib/terrain-data.json','utf8'));
const utm='+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs';
const corners=[[meta.west,meta.south],[meta.east,meta.south],[meta.west,meta.north],[meta.east,meta.north]].map(p=>proj4('EPSG:4326',utm,p));
const bounds=[Math.min(...corners.map(p=>p[0])),Math.min(...corners.map(p=>p[1])),Math.max(...corners.map(p=>p[0])),Math.max(...corners.map(p=>p[1]))];
const response=await fetch('https://earth-search.aws.element84.com/v1/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({collections:['sentinel-2-l2a'],bbox:[meta.west,meta.south,meta.east,meta.north],datetime:'2024-11-29T00:00:00Z/2024-11-29T23:59:59Z',limit:10})});
const features=(await response.json()).features;
const images=[];
for(const feature of features){
 if(!feature.assets.visual)continue;
 const tiff=await fromUrl(feature.assets.visual.href);
 const image=await tiff.getImage();const [left,bottom,right,top]=image.getBoundingBox();
 const box=[Math.max(left,bounds[0]),Math.max(bottom,bounds[1]),Math.min(right,bounds[2]),Math.min(top,bounds[3])];
 if(box[0]>=box[2]||box[1]>=box[3])continue;
 const width=Math.ceil((box[2]-box[0])/22),height=Math.ceil((box[3]-box[1])/22);
 const raster=await tiff.readRasters({bbox:box,width,height,interleave:true});
 images.push({box,width,height,raster,id:feature.id,url:feature.assets.visual.href});
 console.log('Read',feature.id,width,height);
}
const size=2048,out=Buffer.alloc(size*size*3);let missing=0;
for(let y=0;y<size;y++)for(let x=0;x<size;x++){
 const lon=meta.west+(meta.east-meta.west)*x/(size-1),lat=meta.north-(meta.north-meta.south)*y/(size-1);
 const [e,n]=proj4('EPSG:4326',utm,[lon,lat]);let found=false;
 for(const image of images){const [l,b,r,t]=image.box;if(e<l||e>=r||n<b||n>=t)continue;
 const px=Math.min(image.width-1,Math.floor((e-l)/(r-l)*image.width)),py=Math.min(image.height-1,Math.floor((t-n)/(t-b)*image.height)),idx=(py*image.width+px)*3;
 if(image.raster[idx]+image.raster[idx+1]+image.raster[idx+2]<3)continue;
 const dest=(y*size+x)*3;out[dest]=image.raster[idx];out[dest+1]=image.raster[idx+1];out[dest+2]=image.raster[idx+2];found=true;break;
 }
 if(!found){missing++;const d=(y*size+x)*3;out[d]=95;out[d+1]=100;out[d+2]=101;}
}
await sharp(out,{raw:{width:size,height:size,channels:3}}).webp({quality:90}).toFile('public/textures/manali-satellite.webp');
await sharp(out,{raw:{width:size,height:size,channels:3}}).resize(1024,1024).webp({quality:82}).toFile('public/textures/manali-satellite-mobile.webp');
await fs.writeFile('public/terrain/satellite-source.json',JSON.stringify({attribution:'Contains modified Copernicus Sentinel data 2024.',date:'2024-11-29',sources:images.map(({id,url})=>({id,url})),modifications:'Cropped, reprojected from UTM 43N to geographic terrain UVs, mosaicked, downsampled to 2048px and encoded as WebP.',missingPixels:missing,license:'https://cds.climate.copernicus.eu/licences/ec-sentinel'},null,2));
console.log('Written satellite texture. Missing pixels:',missing);
