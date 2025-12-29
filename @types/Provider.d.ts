import * as React from 'react';
import { TextDirection } from './theme/ThemeContext';
import { type LocalizationMap } from './types/LocalizationMap';
import { type PdfJsApiProvider } from './types/PdfJsApiProvider';
export interface ThemeProps {
    direction?: TextDirection;
    theme?: string;
}
export declare const Provider: React.FC<{
    children?: React.ReactNode;
    localization?: LocalizationMap;
    pdfApiProvider: PdfJsApiProvider;
    theme?: string | ThemeProps;
    workerUrl: string;
}>;
