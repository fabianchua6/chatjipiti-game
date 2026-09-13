import type { CSSProperties } from 'react';
const paths = {
  image: 'M3 4h18v16H3V4Zm0 12 5-5 5 5 3-3 5 5M16 8h.01',
  time: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 6v6l4 2',
  panel: 'M3 4h18v16H3V4Zm5 0v16',
  plus: 'M12 4v16M4 12h16',
  down: 'm6 9 6 6 6-6',
  chat: 'M4 4h16v12H9l-5 4V4Z',
  edit: 'm15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z',
  games: 'M7 8h10l4 10-3 2-4-4h-4l-4 4-3-2L7 8Zm1 2v5m-2-2h5m5-1h.01m2 3h.01',
  circle: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  grid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
  type: 'M4 5h16M12 5v15m-4 0h8M4 5v3m16-3v3',
  arrow: 'M12 20V4m-6 6 6-6 6 6',
  chevron: 'm9 5 7 7-7 7',
  back: 'm10 5-7 7 7 7M3 12h18',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  mute: 'm10 5-5 4H2v6h3l5 4V5Zm5 4 6 6m-6 0 6-6',
  sound: 'm10 5-5 4H2v6h3l5 4V5Zm5 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
  reset: 'M4 9a8 8 0 1 1 0 6M4 3v6h6',
  check: 'm4 12 5 5L20 6',
  spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z',
  stop: 'M5 5h14v14H5V5Z',
};
export default function Icon({ name, style }: { name: keyof typeof paths; style?: CSSProperties }) {
  return <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name]}/></svg>;
}
