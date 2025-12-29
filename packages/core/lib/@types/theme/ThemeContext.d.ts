import * as React from 'react';
export declare enum TextDirection {
    RightToLeft = "RTL",
    LeftToRight = "LTR"
}
export interface ThemeContextProps {
    currentTheme: string;
    direction?: TextDirection;
    setCurrentTheme: (theme: string) => void;
}
export declare const ThemeContext: React.Context<ThemeContextProps>;
