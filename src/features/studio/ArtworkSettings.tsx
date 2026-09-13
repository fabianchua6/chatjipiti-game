import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { apiRequest, selectArt, useArtLibrary } from '../../lib/appearance';
import type { ArtAsset, ArtKind } from '../../lib/appearance';
import CardFace from '../memory/CardFace';
import Icon from '../../components/Icon';
import './studio.css';

type Generation = { id: string; status: 'queued' | 'running' | 'completed' | 'failed'; asset?: ArtAsset; error?: string };
export default function ArtworkSettings({ kind, disabled = false }: { kind: ArtKind; disabled?: boolean }) {
  const library = useArtLibrary(kind);
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [job, setJob] = useState<Generation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const busy = submitting || job?.status === 'queued' || job?.status === 'running';
  useEffect(() => {
    const controller = new AbortController();
    void apiRequest<{configured:boolean}>('/api/status', undefined, controller.signal).then(value => setConfigured(value.configured)).catch(() => setConfigured(false));
    try { const id = localStorage.getItem(`chatjipiti:generation:${kind}`); if (id) setJob({id,status:'running'}); } catch { /* No persistence. */ }
    return () => controller.abort();
  }, [kind]);
  const jobId = job?.id;
  const jobPending = job?.status === 'queued' || job?.status === 'running';
  useEffect(() => {
    if (!jobId || !jobPending) return;
    const controller = new AbortController();
    let checking = false;
    const poll = async () => {
      if (checking) return;
      checking = true;
      try {
        const next = await apiRequest<Generation>(`/api/generations/${encodeURIComponent(jobId)}`, undefined, controller.signal);
        if (controller.signal.aborted) return;
        setJob(next);
        if (next.status === 'completed' || next.status === 'failed') {
          try { localStorage.removeItem(`chatjipiti:generation:${kind}`); } catch { /* No persistence. */ }
          if (next.asset) { window.dispatchEvent(new Event('chatjipiti:asset-created')); selectArt(next.asset); }
          if (next.error) setError(next.error);
        }
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(failure instanceof Error ? failure.message : 'Could not check the image.');
          setJob(null);
          try { localStorage.removeItem(`chatjipiti:generation:${kind}`); } catch { /* No persistence. */ }
        }
      } finally { checking = false; }
    };
    const timer = setInterval(() => { void poll(); }, 1800);
    void poll();
    return () => { controller.abort(); clearInterval(timer); };
  }, [jobId, jobPending, kind]);

  async function connect(event: FormEvent) {
    event.preventDefault(); if (!apiKey.trim() || connecting) return;
    setConnecting(true); setError('');
    try { await apiRequest('/api/setup-key', {apiKey:apiKey.trim()}); setApiKey(''); setConfigured(true); setShowSetup(false); window.dispatchEvent(new Event('chatjipiti:api-connected')); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not connect.'); }
    finally { setConnecting(false); }
  }
  async function generate(event: FormEvent) {
    event.preventDefault(); if (!prompt.trim() || busy || !configured) return;
    setSubmitting(true); setError(''); setJob(null);
    try { const next = await apiRequest<Generation>('/api/generate', {kind,prompt:prompt.trim(),name:name.trim() || undefined}); setJob(next); try { localStorage.setItem(`chatjipiti:generation:${kind}`,next.id); } catch { /* Polling still works. */ } }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not start generation.'); }
    finally { setSubmitting(false); }
  }
  return <details className="artwork-settings">
    <summary><Icon name="image"/><span>{kind === 'environment' ? 'Environment' : 'Card artwork'}</span><small>{busy ? 'Generating…' : library.selected.name}</small><Icon name="down"/></summary>
    <fieldset className="artwork-panel" disabled={disabled}>
      <legend className="sr-only">{kind === 'environment' ? 'Environment settings' : 'Card artwork settings'}</legend>
      <div className={`art-gallery ${kind === 'cards' ? 'card-gallery' : ''}`}>
        {library.assets.map(asset => <button key={asset.id} className={`art-choice ${library.selected.id === asset.id ? 'is-selected' : ''}`} aria-pressed={library.selected.id === asset.id} onClick={() => library.select(asset)}>
          {asset.kind === 'environment' ? <img src={asset.url} alt={`${asset.name} circle game environment`} loading="lazy"/> : <span className="pack-preview" aria-hidden="true">{[0,1,2,3,4,5].map(index => <CardFace key={index} pack={asset} face={index} paused/>)}</span>}
          <span className="art-choice-caption"><span><b>{asset.name}</b>{asset.id === 'zootopia' && <small>Original cast · Zootopia-inspired</small>}</span>{library.selected.id === asset.id && <Icon name="check"/>}</span>
        </button>)}
      </div>
      <details className="artwork-generate"><summary><Icon name="plus"/>Generate a new {kind === 'environment' ? 'environment' : 'card pack'}<span>GPT-Image-2.5</span></summary>
      <form className="generation-form" onSubmit={generate}>
        <div className="generation-heading"><h2>{kind === 'environment' ? 'Where to next?' : 'Describe your new pack'}</h2></div>
        <p>{kind === 'environment' ? 'Change the setting and outfit. The board, chair and briefcase stay part of the scene.' : 'Describe a set of eighteen distinct symbols. We’ll turn the image into a playable card pack.'}</p>
        <label className="sr-only" htmlFor="art-prompt">Describe your {kind === 'environment' ? 'environment' : 'card art pack'}</label>
        <textarea id="art-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} rows={3} maxLength={800} placeholder={kind === 'environment' ? 'A tiny observatory above the clouds, at golden hour…' : 'Tiny woodland characters with distinct silhouettes and playful outfits…'}/>
        <div className="prompt-chips">{(kind === 'environment' ? ['An underwater research station','A Japanese garden in autumn','A little cabin on Mars'] : ['Tiny cosmic creatures','Pixel pets in playful costumes','Botanical shapes in pastel colors']).map(text => <button key={text} type="button" onClick={() => setPrompt(text)}>{text}</button>)}</div>
        <div className="generation-controls"><label htmlFor="art-name" className="sr-only">Name this creation</label><input id="art-name" value={name} maxLength={60} onChange={event => setName(event.target.value)} placeholder="Give it a name (optional)"/><button className="primary" disabled={!configured || !prompt.trim() || busy} type="submit"><Icon name={busy ? 'time' : 'spark'}/>{busy ? 'Creating your artwork…' : 'Generate artwork'}</button></div>
        {configured === false && <div className="connection-notice"><p>Connect your OpenAI key to generate artwork.</p><button type="button" onClick={() => setShowSetup(value => !value)}>{showSetup ? 'Hide setup' : 'Connect OpenAI'}<Icon name="chevron"/></button></div>}
        {busy && <p role="status" className="generation-progress"><span className="thinking-dot"/>Your artwork is being made. You can close these settings and keep playing.</p>}
        {job?.status === 'completed' && <p role="status" className="generation-progress"><Icon name="check"/>Your new artwork is selected and ready to play.</p>}
        <p className="generation-note">New images use your API credits and are saved on this computer. Generation may take a few minutes.</p>
      </form>
      {showSetup && !configured && <form className="key-setup" onSubmit={connect}><h2>Connect OpenAI</h2><p>The key is stored on this computer’s server and never included in the game download.</p><label htmlFor="openai-key">OpenAI API key</label><input id="openai-key" type="password" autoComplete="off" value={apiKey} onChange={event => setApiKey(event.target.value)} placeholder="sk-…"/><button type="submit" className="primary" disabled={connecting || !apiKey.trim()}>{connecting ? 'Connecting…' : 'Save key locally'}</button></form>}
      {error && <p className="studio-error" role="alert">{error}</p>}
      </details>
    </fieldset>
  </details>;
}
