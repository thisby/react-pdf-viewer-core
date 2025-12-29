import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';
export declare const Text: React.FC<{
    annotation: PdfJs.Annotation;
    childAnnotation?: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}>;
