import Image from 'next/image';
import type { ReactNode } from 'react';
// Shared hero for every inner page: real photo, dark scrim, large serif title.
export default function PageHero({ eyebrow, title, lede, image, alt, position = 'center 50%', blur, scrim, children }: { eyebrow: string; title: ReactNode; lede?: string; image: string; alt: string; position?: string; blur?: string; /** 'left' adds a left-weighted darkening for bright daylight photos. */ scrim?: 'left'; children?: ReactNode }) {
  return <header className="page-hero">
    <Image className="page-hero-photo" src={image} alt={alt} fill priority sizes="100vw" style={{ objectPosition: position }} {...(blur ? { placeholder: 'blur' as const, blurDataURL: blur } : {})} />
    <div className={scrim ? `page-hero-scrim page-hero-scrim--${scrim}` : 'page-hero-scrim'} aria-hidden="true" />
    <div className="page-hero-content">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p className="page-hero-lede">{lede}</p>}
      {children}
    </div>
  </header>;
}
