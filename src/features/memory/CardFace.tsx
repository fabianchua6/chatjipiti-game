import type { ArtAsset } from '../../lib/appearance';
import AgentShape from './AgentShape';
import PetCardFace from './PetCardFace';

export default function CardFace({ pack, face, paused = false }: { pack: ArtAsset; face: number; paused?: boolean }) {
  if (pack.id === 'pets') return <PetCardFace face={face} paused={paused}/>;
  if (pack.url) return <span className="card-atlas-icon" style={{ backgroundImage: `url("${pack.url}")`, backgroundPosition: `${face % 6 / 5 * 100}% ${Math.floor(face / 6) / 2 * 100}%` }}/>;
  return <AgentShape face={face}/>;
}
