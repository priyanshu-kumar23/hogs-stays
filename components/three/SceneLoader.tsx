'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, type ReactNode, useEffect, useState } from 'react';
const MountainScene = dynamic(() => import('./MountainScene'), { ssr: false });
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function SceneLoader() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { const canvas = document.createElement('canvas'); const context = canvas.getContext('webgl2'); setEnabled(Boolean(context)); context?.getExtension('WEBGL_lose_context')?.loseContext(); }, []);
  return <><div className="scene-fallback" aria-hidden="true"><Image src="/images/mountains.jpg" alt="" fill sizes="100vw" /></div>{enabled ? <SceneBoundary><MountainScene /></SceneBoundary> : null}</>;
}
