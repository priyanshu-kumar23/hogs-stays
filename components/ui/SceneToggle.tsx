'use client';
import { useState } from 'react';
import Icon from './Icon';
export default function SceneToggle() { const [enabled,setEnabled]=useState(false); return <button className="scene-toggle" aria-pressed={enabled} onClick={()=>{ const next=!enabled; setEnabled(next); document.documentElement.classList.toggle('explore-scene',next); }}><Icon name="mountain" size={17} />{enabled ? 'Back to the view' : 'Explore in 3D'}<span className="live-dot" /></button>; }
