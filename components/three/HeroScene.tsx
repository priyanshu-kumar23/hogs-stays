'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import { useDeviceTier } from '@/lib/useDeviceTier';
import PrayerFlagsFallback from './PrayerFlagsFallback';
const PrayerFlagsScene = dynamic(() => import('./PrayerFlagsScene'), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

// Dawn-over-the-valley 3D hero background. Renders the tiered WebGL scene when the device can
// take it, and a static frozen composition otherwise (no-WebGL2, reduced motion, low-end).
export default function HeroScene() {
  const config = useDeviceTier();
  const gyro = useRef({ x: 0, y: 0 });
  const [needsGyroPermission, setNeedsGyroPermission] = useState(false);

  useEffect(() => {
    if (config.parallax !== 'gyro') return;
    const Ctor = (window as unknown as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
    if (Ctor?.requestPermission) { setNeedsGyroPermission(true); return; }
    const handler = (event: DeviceOrientationEvent) => {
      gyro.current.x = Math.max(-1, Math.min(1, (event.gamma || 0) / 45));
      gyro.current.y = Math.max(-1, Math.min(1, ((event.beta || 0) - 45) / 45));
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [config.parallax]);

  const requestGyro = () => {
    const Ctor = (window as unknown as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
    Ctor?.requestPermission?.().then(state => {
      setNeedsGyroPermission(false);
      if (state !== 'granted') return; // graceful fallback: parallax simply stays at rest
      window.addEventListener('deviceorientation', (event) => {
        gyro.current.x = Math.max(-1, Math.min(1, (event.gamma || 0) / 45));
        gyro.current.y = Math.max(-1, Math.min(1, ((event.beta || 0) - 45) / 45));
      });
    }).catch(() => setNeedsGyroPermission(false));
  };

  if (config.tier === 'static') return <PrayerFlagsFallback />;
  return <SceneBoundary fallback={<PrayerFlagsFallback />}>
    <PrayerFlagsScene config={config} gyro={gyro} />
    {needsGyroPermission && <button type="button" className="gyro-permission" onClick={requestGyro}>Enable tilt parallax</button>}
  </SceneBoundary>;
}
