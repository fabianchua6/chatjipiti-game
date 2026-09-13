import { useEffect, useState } from 'react';

type Run = { prompt: string; started: number; status: 'working' | 'complete' | 'stopped' };
const DEMO_SECONDS = 30;

/** A deliberately scripted chat: only artwork generation uses the API. */
export function useAgentTask() {
  const [run, setRun] = useState<Run | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const started = run?.started;
  const working = run?.status === 'working';
  useEffect(() => {
    if (!working || started === undefined) return;
    const timer = setInterval(() => {
      const seconds = Math.floor((performance.now() - started) / 1000);
      setElapsed(Math.min(DEMO_SECONDS, seconds));
      if (seconds >= DEMO_SECONDS) setRun(current => current?.started === started ? {...current, status: 'complete'} : current);
    }, 500);
    return () => clearInterval(timer);
  }, [started, working]);
  function start(prompt: string) { setElapsed(0); setRun({prompt,started:performance.now(),status:'working'}); }
  function stop() { setRun(current => current ? {...current,status:'stopped'} : current); }
  function clear() { setRun(null); setElapsed(0); }
  return {run,elapsed,start,stop,clear};
}
