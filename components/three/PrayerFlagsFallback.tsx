// Static layered-image composition used when WebGL2 is unavailable, the device is low-end,
// or the visitor has requested reduced motion. Frozen mid-flutter, no animation loop.
export default function PrayerFlagsFallback() {
  return <div className="flags-fallback" aria-hidden="true">
    <div className="flags-fallback-layer flags-fallback-sky" />
    <div className="flags-fallback-layer flags-fallback-ridge flags-fallback-ridge-3" />
    <div className="flags-fallback-layer flags-fallback-ridge flags-fallback-ridge-2" />
    <div className="flags-fallback-layer flags-fallback-ridge flags-fallback-ridge-1" />
    <svg className="flags-fallback-layer flags-fallback-flags" viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice">
      <path d="M0 20 Q100 55 200 22 Q300 -6 400 24" fill="none" stroke="#00000030" strokeWidth="1" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 14 + i * 27;
        const t = i / 13; const y = 20 + Math.sin(t * Math.PI) * 34;
        const colors = ['#9c4a3c', '#c9a24a', '#4a6b52', '#3d5a73', '#e7ded0'];
        return <rect key={i} x={x - 6} y={y} width="13" height="17" fill={colors[i % colors.length]} opacity=".82" transform={`rotate(${(i % 2 ? 8 : -6)} ${x} ${y})`} />;
      })}
    </svg>
  </div>;
}
