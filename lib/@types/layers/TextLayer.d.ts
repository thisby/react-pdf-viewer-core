import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';
import { type Plugin } from '../types/Plugin';
export declare const TextLayer: React.FC<{
    containerRef: React.RefObject<HTMLDivElement>;
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    onRenderTextCompleted: () => void;
}>;
