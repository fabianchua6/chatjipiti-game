import GameRoundControls from '../../components/GameRoundControls';
import Icon from '../../components/Icon';
import type { CircleScore, GameMode } from '../../lib/challenges';

type Props = {
  score: CircleScore;
  best: number | null;
  mode: GameMode;
  reward: 'earned' | 'claimed' | 'unavailable' | null;
  saved: boolean;
  onRestart: () => void;
};

export default function CircleResult({ score, best, mode, reward, saved, onRestart }: Props) {
  const blessed = score.total >= 90;
  const verdict = blessed ? 'Blessed by Tibo.' : score.total >= 75 ? 'Almost perfect.' : 'Give it another go.';
  return <div className="circle-round-result">
    <div id="circle-result-summary" role="status">
      <h2>{verdict}</h2>
      <p className="circle-round-score"><strong>{score.total}</strong><span>/100</span></p>
    </div>
    <dl className="circle-score-breakdown">
      <div><dt>Position</dt><dd>{score.position}<span>/50</span></dd></div>
      <div><dt>Size</dt><dd>{score.size}<span>/50</span></dd></div>
    </dl>
    {best !== null && <p className="circle-round-best">{best > score.total ? <>Personal best <strong>{best}</strong></> : 'Personal best'}</p>}
    {blessed && mode === 'daily' && <p className="circle-round-reward" role="status"><Icon name="reset"/><span>{reward === null ? 'Banking demo reset…' : reward === 'earned' ? '+1 demo reset banked' : reward === 'claimed' ? 'Demo reset already banked' : 'Couldn’t save the demo reset'}</span></p>}
    {!saved && <p className="circle-save-error" role="status">Your score couldn’t be saved on this browser.</p>}
    <div className="circle-round-actions button-row"><GameRoundControls game="circle" onRestart={onRestart}/></div>
  </div>;
}
