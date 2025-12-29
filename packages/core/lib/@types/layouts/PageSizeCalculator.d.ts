import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
import { type PageSize } from '../types/PageSize';
import { type PdfJs } from '../types/PdfJs';
export declare const PageSizeCalculator: React.FC<{
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    render(estimatedPageSizes: PageSize[], initialScale: number): React.ReactElement;
    scrollMode: ScrollMode;
    viewMode: ViewMode;
}>;
