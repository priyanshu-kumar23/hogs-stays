import { averageRating, GOOGLE_REVIEWS_URL, reviews } from '@/data/reviews';
import { guestVideos } from '@/data/videos';
import ReviewsCarousel from './ReviewsCarousel';
import VideoPlayer from './VideoPlayer';
import GoogleLogo, { Stars } from './GoogleLogo';

// Guest Reviews: Google summary bar, "Guest moments" video row, masonry of review cards (swipe carousel on mobile).
export default function ReviewsSection() {
  const average = averageRating.toFixed(1);
  return <section id="reviews" className="section reviews" aria-labelledby="reviews-title">
    <div className="reviews-head" data-reveal>
      <p className="eyebrow">WORDS FROM OUR GUESTS</p>
      <h2 id="reviews-title">Stories from<br /><em>the mountains.</em></h2>
    </div>
    <div className="reviews-summary" data-reveal>
      <div className="rs-brand"><GoogleLogo size={34} /><div><div className="rs-score"><strong>{average}</strong><Stars rating={averageRating} /></div><span>Based on Google reviews</span></div></div>
      <div className="rs-actions">
        <a className="button outline rs-btn" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"><GoogleLogo size={18} />Read all reviews on Google</a>
        <a className="button rs-btn rs-write" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>Write a review</a>
      </div>
    </div>
    <div className="guest-moments">
      <p className="eyebrow">GUEST MOMENTS</p>
      <div className="vp-row">{guestVideos.map(video => <VideoPlayer key={video.src} video={video} />)}</div>
    </div>
    <ReviewsCarousel reviews={reviews} />
  </section>;
}
