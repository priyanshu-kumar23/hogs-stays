import { founderVideo } from '@/data/videos';
import VideoPlayer from './VideoPlayer';

// Featured vid3 under the "Gazal & Saloni" label in the About section (home + /about).
export default function FounderVideo() {
  return <figure className="founder-video"><VideoPlayer video={founderVideo} variant="feature" /></figure>;
}
