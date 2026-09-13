import type { ReactNode } from 'react';



const shapes: ReactNode[] = [
  <g fill="#c35089" stroke="#854465"><ellipse cx="25" cy="23" rx="10" ry="13" transform="rotate(-35 25 23)"/><ellipse cx="40" cy="23" rx="10" ry="13" transform="rotate(35 40 23)"/><ellipse cx="25" cy="40" rx="10" ry="13" transform="rotate(35 25 40)"/><ellipse cx="40" cy="40" rx="10" ry="13" transform="rotate(-35 40 40)"/><circle cx="32" cy="7" r="3"/><circle cx="7" cy="32" r="3"/><circle cx="57" cy="32" r="3"/><circle cx="32" cy="57" r="3"/></g>,
  <g stroke="#226276"><path d="M11 9Q7 9 10 15L29 52Q32 58 35 52L54 15Q57 9 53 9Z" fill="#2b9aad"/><path d="M11 55Q7 55 10 49L29 12Q32 6 35 12L54 49Q57 55 53 55Z" fill="#56bfd0" fillOpacity=".8"/><path d="m23 32 9-15 10 15-10 16Z" fill="#6bc4d1"/></g>,
  <g fill="#f06569" stroke="#a43843">{[[20,20],[44,20],[20,44],[44,44]].map(([x,y])=><g key={`${x}-${y}`}><circle cx={x} cy={y} r="12"/><circle cx={x} cy={y} r="8" fill="none" stroke="#ff9a9a"/><circle cx={x} cy={y} r="5" fill="none"/></g>)}</g>,
  <g fill="#ff666b" stroke="#b94148"><rect x="18" y="5" width="28" height="29" rx="13"/><rect x="18" y="30" width="28" height="29" rx="13"/><rect x="5" y="18" width="28" height="29" rx="13"/><rect x="31" y="18" width="28" height="29" rx="13"/><path d="m32 23 9 9-9 9-9-9Z" fill="#bc424f"/></g>,
  <g stroke="#6d3fa1"><path d="m32 7 25 25-25 25L7 32Z" fill="#73509d"/>{[9,32,55].map(y=><circle key={y} cx="32" cy={y} r="7" fill="#b575f6"/>)}</g>,
  <g stroke="#d7a649" fill="#f5cb69"><path d="M32 3v12m0 34v12M3 32h12m34 0h12M11 11l9 9m24 24 9 9M11 53l9-9m24-24 9-9" strokeWidth="5"/><circle cx="32" cy="32" r="15"/></g>,
  <g fill="#63ceb0" stroke="#2d8e79">{[0,90,180,270].map(r=><path key={r} d="M32 32V6L54 20Z" transform={`rotate(${r} 32 32)`}/>)}</g>,
  <g fill="#6ea8ea" stroke="#436daa"><path d="m32 3 8 21 21 8-21 8-8 21-8-21-21-8 21-8Z"/><path d="m32 18 14 14-14 14-14-14Z" fill="#b1d2ff"/></g>,
  <g fill="none" stroke="#f49b60" strokeWidth="5"><path d="m19 9 26 0 13 23-13 23H19L6 32Z"/><path d="m25 20 14 0 7 12-7 12H25l-7-12Z"/></g>,
  <g fill="none" stroke="#bc98ed" strokeWidth="4"><ellipse cx="32" cy="32" rx="27" ry="11" transform="rotate(40 32 32)"/><ellipse cx="32" cy="32" rx="27" ry="11" transform="rotate(-40 32 32)"/><circle cx="32" cy="32" r="5" fill="#dcc3ff"/></g>,
  <g fill="none" stroke="#b8ce61" strokeWidth="9" strokeLinejoin="round"><path d="m9 14 18 18L9 50m27-36 18 18-18 18"/></g>,
  <g fill="#dd8eb0" stroke="#9d526f"><path d="M7 12Q28 12 32 32Q28 52 7 52ZM57 12Q36 12 32 32Q36 52 57 52Z"/><circle cx="32" cy="32" r="7" fill="#ffd0e0"/></g>,
  <path d="M55 55H9V9h42v36H20V20h20v15H30" fill="none" stroke="#5bcec9" strokeWidth="6" strokeLinejoin="round"/>,
  <g fill="#e9b74f" stroke="#a67b2c">{[[32,16],[16,32],[48,32],[32,48]].map(([x,y])=><path key={`${x}-${y}`} d={`m${x} ${y-12} 12 12-12 12-12-12Z`}/>)}</g>,
  <g fill="#8d9afa" stroke="#5f66af"><path d="M43 6A27 27 0 1 0 57 43 23 23 0 0 1 43 6Z"/><circle cx="46" cy="21" r="5"/></g>,
  <g fill="#e99bd5" stroke="#a9669b"><path d="m32 4 7 20 21 8-21 7-7 21-8-21-20-7 20-8Z"/><path d="m32 22 10 10-10 10-10-10Z" fill="#ffd5f1"/></g>,
  <g fill="none" stroke="#85c988" strokeWidth="5"><rect x="8" y="8" width="48" height="48" rx="3"/><rect x="20" y="20" width="24" height="24" transform="rotate(45 32 32)"/></g>,
  <g fill="#edac90" stroke="#ad745f">{[0,120,240].map(r=><ellipse key={r} cx="32" cy="19" rx="12" ry="17" transform={`rotate(${r} 32 32)`}/>)}<circle cx="32" cy="32" r="7" fill="#ffdcc3"/></g>,
];

export default function AgentShape({ face }: { face: number }) {
  return <svg viewBox="0 0 64 64" aria-hidden="true" strokeWidth="1.5" strokeLinejoin="round">{shapes[face]}</svg>;
}
