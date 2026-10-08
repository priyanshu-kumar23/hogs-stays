'use client';
import { useEffect } from 'react';
import { canonicalRoomId, roomById, roomHref } from '@/lib/rooms';

// Old links keep working now that every room has its own page: /stays/panorama#valley-view (or the old #jacuzzi-suite) goes to that room's page.
// (?room=... deep links are redirected in next.config.ts; #book is handled by the enquiry panel.)
export default function RoomAnchorAlias() {
  useEffect(() => {
    const fix = () => {
      const id = canonicalRoomId(location.hash.slice(1));
      if (id && roomById(id)) location.replace(roomHref(id));
    };
    fix(); addEventListener('hashchange', fix);
    return () => removeEventListener('hashchange', fix);
  }, []);
  return null;
}
