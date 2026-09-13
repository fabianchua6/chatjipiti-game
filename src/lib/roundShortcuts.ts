type KeyEvent = Pick<KeyboardEvent, 'key' | 'code' | 'repeat' | 'defaultPrevented' | 'isComposing' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey'>;

export function roundShortcut(event: KeyEvent, completed: boolean): 'restart' | 'next-game' | null {
  if (!completed || event.defaultPrevented || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return null;
  if (event.code === 'Space' || event.key === ' ') return 'restart';
  return event.key === 'Enter' ? 'next-game' : null;
}
