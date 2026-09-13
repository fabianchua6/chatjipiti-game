import { PET_FACES } from '../../lib/cardCharacters';
import './pet-cards.css';

export default function PetCardFace({ face, paused = false }: { face: number; paused?: boolean }) {
  const pet = PET_FACES[face];
  return <span className={`pet-card-face ${pet.variant === 'starry' ? 'is-starry' : ''}`} aria-hidden="true">
    {pet.variant === 'starry' && <svg className="pet-stars" viewBox="0 0 100 108" fill="currentColor"><path d="m78 2 4 10 11 1-9 7 3 11-9-6-9 6 3-11-9-7 11-1Z M12 46l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z M85 76l2 5 6 1-5 4 2 5-5-3-5 3 2-5-5-4 6-1Z"/></svg>}
    <span className="pet-sprite" style={{ backgroundImage: `url("/card-packs/pets/${pet.id}.webp")`, animationPlayState: paused ? 'paused' : 'running' }}/>
  </span>;
}
