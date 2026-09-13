import { createContext } from 'react';

/** Keeps shared round controls inside an embedded game when a host is present. */
export const InlineGameNavigation = createContext<((game: string) => void) | null>(null);
