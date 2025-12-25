'use client';
import * as React from 'react';
import { DefaultLocalization, LocalizationContext } from './localization/LocalizationContext';
import { TextDirection, ThemeContext } from './theme/ThemeContext';
import { withTheme } from './theme/withTheme';
import { PdfJsApiContext } from './vendors/PdfJsApiContext';
const STYLE_ID = '___rpv-styles___';
export const Provider = ({ children, localization, pdfApiProvider, theme = {
    direction: TextDirection.LeftToRight,
    theme: 'light',
}, workerUrl, }) => {
    pdfApiProvider.GlobalWorkerOptions.workerSrc = workerUrl;
    const [l10n, setL10n] = React.useState(localization || DefaultLocalization);
    const localizationContext = { l10n, setL10n };
    React.useEffect(() => {
        if (localization) {
            setL10n(localization);
        }
    }, [localization]);
    const themeProps = typeof theme === 'string' ? { direction: TextDirection.LeftToRight, theme } : theme;
    const themeStr = themeProps.theme || 'light';
    const [currentTheme, setCurrentTheme] = withTheme(themeStr);
    const themeContext = Object.assign({}, {
        currentTheme,
        direction: themeProps.direction,
        setCurrentTheme,
    });
    React.useInsertionEffect(() => {
        let styleEle = document.head.querySelector(`style[id=${STYLE_ID}]`);
        if (!styleEle) {
            styleEle = document.createElement('style');
            styleEle.setAttribute('id', STYLE_ID);
            document.head.appendChild(styleEle);
            styleEle.textContent = `
.hiddenCanvasElement {
    display: none;
    opacity: 0;
}`;
        }
        return () => {
            document.head.removeChild(styleEle);
        };
    }, []);
    return (React.createElement(PdfJsApiContext.Provider, { value: { pdfJsApiProvider: pdfApiProvider } },
        React.createElement(LocalizationContext.Provider, { value: localizationContext },
            React.createElement(ThemeContext.Provider, { value: themeContext }, children))));
};
