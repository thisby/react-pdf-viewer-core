import * as React from 'react';
import { type PdfJsApiProvider } from '../types/PdfJsApiProvider';
export interface PdfJsApiContextProps {
    pdfJsApiProvider?: PdfJsApiProvider;
}
export declare const PdfJsApiContext: React.Context<PdfJsApiContextProps>;
