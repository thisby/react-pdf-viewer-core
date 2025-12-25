import { FullScreenMode } from '../structs/FullScreenMode';
import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
import { type OpenFile } from './OpenFile';
export interface ViewerState {
    file: OpenFile;
    fullScreenMode: FullScreenMode;
    pageIndex: number;
    pageHeight: number;
    pageWidth: number;
    pagesRotation: Map<number, number>;
    rotatedPage?: number;
    rotation: number;
    scale: number;
    scrollMode: ScrollMode;
    viewMode: ViewMode;
}
