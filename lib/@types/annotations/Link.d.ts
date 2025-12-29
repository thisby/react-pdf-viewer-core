import * as React from 'react';
import { type Destination } from '../types/Destination';
import { type PdfJs } from '../types/PdfJs';
export declare const Link: React.FC<{
    annotation: PdfJs.Annotation;
    annotationContainerRef: React.RefObject<HTMLElement>;
    doc: PdfJs.PdfDocument;
    outlines: PdfJs.Outline[];
    page: PdfJs.Page;
    pageIndex: number;
    scale: number;
    viewport: PdfJs.ViewPort;
    onExecuteNamedAction(action: string): void;
    onJumpFromLinkAnnotation(destination: Destination): void;
    onJumpToDest(destination: Destination): void;
}>;
