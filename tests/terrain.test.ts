import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { elevation,geoPosition,terrainMetadata } from '../lib/terrain';
const bytes=readFileSync('public/terrain/manali-dem.bin');
const field={values:new Uint16Array(bytes.buffer,bytes.byteOffset,bytes.length/2)};
test('Manali DEM dimensions and elevations match the declared source grid',()=>{
 assert.equal(bytes.length,terrainMetadata.size**2*2);
 let min=Infinity,max=-Infinity;for(const value of field.values){min=Math.min(min,value);max=Math.max(max,value);}
 assert.equal(min,terrainMetadata.min);assert.equal(max,terrainMetadata.max);assert.ok(max>5500);
});
test('Manali geolocation samples a plausible valley elevation, with no vertical exaggeration',()=>{
 const [x,z]=geoPosition(77.1887,32.2396);
 const altitude=elevation(field,x,z)*terrainMetadata.metresPerUnit+terrainMetadata.baseElevation;
 assert.ok(altitude>1750&&altitude<2400,'Manali should sit in the valley, not on a synthetic peak');
 assert.ok(Number.isFinite(elevation(field,1e4,-1e4)));
});
