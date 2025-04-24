import React, { createContext, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
// importing types
import type { ThemeOptions } from '@mui/material';
import type { Theme, ColorContextType } from '../types/Color.types';
import type { ContextChildrenProps } from '../types/Context.types';
// importing contexts
import { useSettingsContext } from '../features/settings';
// importing colors
import {
    green,
    grey,
    lightBlue,
    purple,
    red,
    yellow,
} from '@mui/material/colors';

const palette: Record<Theme, ThemeOptions['palette']> = {
    'light': {
        mode: 'light',
        primary: {
            main: '#512da8',
            light: '#7e57c2',
            dark: '#4527a0',
            contrastText: '#ffffff',
        },
        secondary: purple,
        error: red,
        warning: yellow,
        info: grey,
        success: green,
        divider: '#424242',
        text: {
            primary: '#000000',
            secondary: '#474646',
            disabled: '#0090c1',
        },
        background: {
            paper: '#fafafa',
            default: '#eeeeee',
        }
    },
    'dark': {
        mode: 'dark',
        primary: {
            main: '#1976d2',  // 700
            light: '#42a5f5', // 400
            dark: '#1565c0',  // 800
            contrastText: '#ffffff',
        },
        secondary: lightBlue,
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#f57c00',
            contrastText: '#ffffff'
        },
        info: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff'
        },
        success: {
            main: '#66bb6a',
            light: '#81c784',
            dark: '#388e3c',
            contrastText: '#ffffff'
        },
        divider: '#2f2f2f',
        text: {
            primary: '#ffffff',
            secondary: '#b8b8b8',
            disabled: '#898989',
        },
        background: {
            default: '#000000',
            paper: '#121212',
        },
        action: {
            active: '#ffffff',
            hover: 'rgba(255, 255, 255, 0.08)',
            hoverOpacity: 0.08,
            selected: 'rgba(255, 255, 255, 0.16)',
            selectedOpacity: 0.16,
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(255, 255, 255, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
        }
    },
    'retro': {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: lightBlue,
        error: red,
        warning: yellow,
        info: grey,
        success: green,
        divider: '#424242',
        text: {
            primary: '#000000',
            secondary: '#474646',
            disabled: '#0090c1',
        },
        background: {
            paper: '#fafafa',
            default: '#eeeeee',
        }
    }
};

const getDesignTokens = (theme: Theme): ThemeOptions => ({
    palette: {
        ...palette[theme], grey: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
            A100: '#f5f5f5',
            A200: '#eeeeee',
            A400: '#bdbdbd',
            A700: '#616161',
        }
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    }
});

const ColorContext = createContext<ColorContextType>({
    palette: palette,
    theme: 'dark',
});
export const useColorContext = () => useContext(ColorContext);
export const ColorProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const { settings } = useSettingsContext();
    const theme = settings.theme;

    const themeOptions = useMemo(() => ({
        palette,
        theme,
    }), [theme]);

    const providerTheme = useMemo(() => {
        return createTheme(getDesignTokens(theme));
    }, [theme]);

    return (
        <ColorContext.Provider value={themeOptions}>
            <ThemeProvider theme={providerTheme}>
                {children}
            </ThemeProvider>
        </ColorContext.Provider>
    );
};