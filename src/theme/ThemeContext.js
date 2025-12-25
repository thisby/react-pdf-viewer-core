'use client';
import * as React from 'react';
export var TextDirection;
(function (TextDirection) {
    TextDirection["RightToLeft"] = "RTL";
    TextDirection["LeftToRight"] = "LTR";
})(TextDirection || (TextDirection = {}));
export const ThemeContext = React.createContext({
    currentTheme: 'light',
    direction: TextDirection.LeftToRight,
    setCurrentTheme: () => { },
});
