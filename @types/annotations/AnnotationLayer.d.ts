import * as React from 'react';
import { type Destination } from '../types/Destination';
import { type PdfJs } from '../types/PdfJs';
import { type Plugin } from '../types/Plugin';
export declare const AnnotationLayer: React.FC<{
    doc: PdfJs.PdfDocument;
    outlines: PdfJs.Outline[];
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    onExecuteNamedAction(action: string): void;
    onJumpFromLinkAnnotation(destination: Destination): void;
    onJumpToDest(destination: Destination): void;
}>;
