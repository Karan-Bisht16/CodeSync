import type { ThemeOptions } from '@mui/material';

export type Theme = 'light' | 'dark' | 'retro';

export type ColorContextType = {
    palette: Record<Theme, ThemeOptions['palette']>,
    theme: Theme,
};