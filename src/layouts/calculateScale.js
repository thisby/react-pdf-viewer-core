import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
const SCROLL_BAR_WIDTH = 17;
const PAGE_PADDING = 8;
export const calculateScale = (container, pageHeight, pageWidth, scale, viewMode, numPages) => {
    let w = pageWidth;
    switch (true) {
        case viewMode === ViewMode.DualPageWithCover && numPages >= 3:
        case viewMode === ViewMode.DualPage && numPages >= 3:
            w = 2 * pageWidth;
            break;
        default:
            w = pageWidth;
            break;
    }
    switch (scale) {
        case SpecialZoomLevel.ActualSize:
            return 1;
        case SpecialZoomLevel.PageFit:
            return Math.min((container.clientWidth - SCROLL_BAR_WIDTH) / w, (container.clientHeight - 2 * PAGE_PADDING) / pageHeight);
        case SpecialZoomLevel.PageWidth:
            return (container.clientWidth - SCROLL_BAR_WIDTH) / w;
    }
};
