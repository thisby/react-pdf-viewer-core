import * as React from 'react';
import { RotateDirection } from '../structs/RotateDirection';
import { type PdfJs } from './PdfJs';
import { type Slot } from './Slot';
export interface RenderPageProps {
    annotationLayer: Slot;
    canvasLayer: Slot;
    canvasLayerRendered: boolean;
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    rotation: number;
    scale: number;
    svgLayer: Slot;
    textLayer: Slot;
    textLayerRendered: boolean;
    width: number;
    markRendered(pageIndex: number): void;
    onRotatePage(direction: RotateDirection): void;
}
export type RenderPage = (props: RenderPageProps) => React.ReactElement;
