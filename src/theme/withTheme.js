'use client';
import * as React from 'react';
import { isDarkMode } from '../utils/isDarkMode';
import { DARK_THEME } from './darkTheme';
import { LIGHT_THEME } from './lightTheme';
import { useTheme } from './useTheme';
export const withTheme = (theme) => {
    const initialTheme = React.useMemo(() => (theme === 'auto' ? (isDarkMode() ? 'dark' : 'light') : theme), []);
    const [currentTheme, setCurrentTheme] = React.useState(initialTheme);
    useTheme(currentTheme === 'light' ? LIGHT_THEME : DARK_THEME);
    React.useEffect(() => {
        if (theme !== 'auto') {
            return;
        }
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
            setCurrentTheme(e.matches ? 'dark' : 'light');
        };
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, []);
    return [currentTheme, setCurrentTheme];
};
