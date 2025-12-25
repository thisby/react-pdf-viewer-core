'use client';
import * as React from 'react';
var PageRenderStatus;
(function (PageRenderStatus) {
    PageRenderStatus["NotRenderedYet"] = "NotRenderedYet";
    PageRenderStatus["Rendering"] = "Rendering";
    PageRenderStatus["Rendered"] = "Rendered";
})(PageRenderStatus || (PageRenderStatus = {}));
const OUT_OF_RANGE_VISIBILITY = -9999;
export const useRenderQueue = ({ doc }) => {
    const { numPages } = doc;
    const docId = doc.loadingTask.docId;
    const initialPageVisibilities = React.useMemo(() => Array(numPages)
        .fill(null)
        .map((_, pageIndex) => ({
        pageIndex,
        renderStatus: PageRenderStatus.NotRenderedYet,
        visibility: OUT_OF_RANGE_VISIBILITY,
    })), [docId]);
    const latestRef = React.useRef({
        currentRenderingPage: -1,
        startRange: 0,
        endRange: numPages - 1,
        visibilities: initialPageVisibilities,
    });
    const markNotRendered = () => {
        for (let i = 0; i < numPages; i++) {
            latestRef.current.visibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
        }
    };
    const markRendered = (pageIndex) => {
        latestRef.current.visibilities[pageIndex].renderStatus = PageRenderStatus.Rendered;
    };
    const markRendering = (pageIndex) => {
        if (latestRef.current.currentRenderingPage !== -1 &&
            latestRef.current.currentRenderingPage !== pageIndex &&
            latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus ===
                PageRenderStatus.Rendering) {
            latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus =
                PageRenderStatus.NotRenderedYet;
        }
        latestRef.current.visibilities[pageIndex].renderStatus = PageRenderStatus.Rendering;
        latestRef.current.currentRenderingPage = pageIndex;
    };
    const setRange = (startIndex, endIndex) => {
        latestRef.current.startRange = startIndex;
        latestRef.current.endRange = endIndex;
        for (let i = 0; i < numPages; i++) {
            if (i < startIndex || i > endIndex) {
                latestRef.current.visibilities[i].visibility = OUT_OF_RANGE_VISIBILITY;
                latestRef.current.visibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
            }
            else if (latestRef.current.visibilities[i].visibility === OUT_OF_RANGE_VISIBILITY) {
                latestRef.current.visibilities[i].visibility = -1;
            }
        }
    };
    const setOutOfRange = (pageIndex) => {
        setVisibility(pageIndex, OUT_OF_RANGE_VISIBILITY);
    };
    const setVisibility = (pageIndex, visibility) => {
        latestRef.current.visibilities[pageIndex].visibility = visibility;
    };
    const getHighestPriorityPage = () => {
        const visiblePages = latestRef.current.visibilities
            .slice(latestRef.current.startRange, latestRef.current.endRange + 1)
            .filter((item) => item.visibility > OUT_OF_RANGE_VISIBILITY);
        if (!visiblePages.length) {
            return -1;
        }
        const firstVisiblePage = visiblePages[0].pageIndex;
        const lastVisiblePage = visiblePages[visiblePages.length - 1].pageIndex;
        const numVisiblePages = visiblePages.length;
        let maxVisibilityPageIndex = -1;
        let maxVisibility = -1;
        for (let i = 0; i < numVisiblePages; i++) {
            if (visiblePages[i].renderStatus === PageRenderStatus.Rendering) {
                return -1;
            }
            if (visiblePages[i].renderStatus === PageRenderStatus.NotRenderedYet) {
                if (maxVisibilityPageIndex === -1 || visiblePages[i].visibility > maxVisibility) {
                    maxVisibilityPageIndex = visiblePages[i].pageIndex;
                    maxVisibility = visiblePages[i].visibility;
                }
            }
        }
        if (maxVisibilityPageIndex > -1) {
            return maxVisibilityPageIndex;
        }
        if (lastVisiblePage + 1 < numPages &&
            latestRef.current.visibilities[lastVisiblePage + 1].renderStatus !== PageRenderStatus.Rendered) {
            return lastVisiblePage + 1;
        }
        else if (firstVisiblePage - 1 >= 0 &&
            latestRef.current.visibilities[firstVisiblePage - 1].renderStatus !== PageRenderStatus.Rendered) {
            return firstVisiblePage - 1;
        }
        return -1;
    };
    const isInRange = (pageIndex) => pageIndex >= latestRef.current.startRange && pageIndex <= latestRef.current.endRange;
    return {
        getHighestPriorityPage,
        isInRange,
        markNotRendered,
        markRendered,
        markRendering,
        setOutOfRange,
        setRange,
        setVisibility,
    };
};
