'use client';
import { useGLTF } from '@react-three/drei';
import Terrain from './Terrain';
import { type HeightField } from '@/lib/terrain';
function ProductionTerrain({url}:{url:string}) { const {scene}=useGLTF(url);return <primitive object={scene}/>; }
export default function Mountains({field,low}:{field:HeightField;low:boolean}) {
 // TODO(asset): place licensed, Meshopt-compressed terrain at public/models/himalaya.glb,
 // then set NEXT_PUBLIC_HIMALAYA_MODEL=/models/himalaya.glb. Use the coordinate
 // system documented in public/models/README.md; the DEM remains the ground sampler.
 const model=process.env.NEXT_PUBLIC_HIMALAYA_MODEL;
 return model?<ProductionTerrain url={model}/>:<Terrain field={field} low={low}/>;
}
