import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';
export declare const AnnotationLoader: React.FC<{
    page: PdfJs.Page;
    renderAnnotations(annotations: PdfJs.Annotation[]): React.ReactElement;
}>;
