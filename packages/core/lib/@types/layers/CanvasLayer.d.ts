import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';
import { type Plugin } from '../types/Plugin';
export declare const CanvasLayer: React.FC<{
    canvasLayerRef: React.RefObject<HTMLCanvasElement>;
    height: number;
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    width: number;
    onRenderCanvasCompleted: () => void;
}>;
