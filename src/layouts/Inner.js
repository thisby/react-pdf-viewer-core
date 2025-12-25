'use client';
import * as React from 'react';
import { useFullScreen } from '../fullscreen/useFullScreen';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { useRenderQueue } from '../hooks/useRenderQueue';
import { useTrackResize } from '../hooks/useTrackResize';
import { PageLayer } from '../layers/PageLayer';
import { LocalizationContext } from '../localization/LocalizationContext';
import { FullScreenMode } from '../structs/FullScreenMode';
import { RotateDirection } from '../structs/RotateDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
import styles from '../styles/inner.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { chunk } from '../utils/chunk';
import { classNames } from '../utils/classNames';
import { getFileExt } from '../utils/getFileExt';
import { clearPagesCache, getPage } from '../utils/managePages';
import { useVirtual } from '../virtualizer/useVirtual';
import { calculateScale } from './calculateScale';
import { useDestination } from './useDestination';
import { useOutlines } from './useOutlines';
const DEFAULT_PAGE_LAYOUT = {
    buildPageStyles: () => ({}),
    transformSize: ({ size }) => size,
};
const ZERO_OFFSET = {
    left: 0,
    top: 0,
};
export const Inner = ({ currentFile, defaultScale, doc, enableSmoothScroll, estimatedPageSizes, initialPage, initialRotation, initialScale, initialScrollMode, initialViewMode, pageLayout, plugins, renderPage, setRenderRange, viewerState, onDocumentLoad, onOpenFile, onPageChange, onRotate, onRotatePage, onZoom, }) => {
    const { numPages } = doc;
    const docId = doc.loadingTask.docId;
    const { l10n } = React.useContext(LocalizationContext);
    const themeContext = React.useContext(ThemeContext);
    const isRtl = themeContext.direction === TextDirection.RightToLeft;
    const containerRef = React.useRef(null);
    const pagesRef = React.useRef(null);
    const destinationManager = useDestination({
        getCurrentPage: () => stateRef.current.pageIndex,
    });
    const [pagesRotationChanged, setPagesRotationChanged] = React.useState(false);
    const outlines = useOutlines(doc);
    const stateRef = React.useRef(viewerState);
    const keepSpecialZoomLevelRef = React.useRef(typeof defaultScale === 'string' ? defaultScale : null);
    const forceTargetPageRef = React.useRef({
        targetPage: -1,
        zoomRatio: 1,
    });
    const forceTargetZoomRef = React.useRef(-1);
    const forceTargetInitialPageRef = React.useRef(initialPage);
    const fullScreen = useFullScreen({
        targetRef: pagesRef,
    });
    const [renderPageIndex, setRenderPageIndex] = React.useState(-1);
    const [renderQueueKey, setRenderQueueKey] = React.useState(0);
    const renderQueue = useRenderQueue({ doc });
    React.useEffect(() => {
        return () => {
            clearPagesCache();
        };
    }, [docId]);
    const layoutBuilder = React.useMemo(() => Object.assign({}, DEFAULT_PAGE_LAYOUT, pageLayout), []);
    const [areSizesCalculated, setSizesCalculated] = React.useState(false);
    const [pageSizes, setPageSizes] = React.useState(estimatedPageSizes);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [pagesRotation, setPagesRotation] = React.useState(new Map());
    const [rotation, setRotation] = React.useState(initialRotation);
    const [scale, setScale] = React.useState(initialScale);
    const [scrollMode, setScrollMode] = React.useState(initialScrollMode);
    const [viewMode, setViewMode] = React.useState(initialViewMode);
    const sizes = React.useMemo(() => Array(numPages)
        .fill(0)
        .map((_, pageIndex) => {
        const pageHeight = pageSizes[pageIndex].pageHeight;
        const pageWidth = pageSizes[pageIndex].pageWidth;
        const rect = Math.abs(rotation) % 180 === 0
            ? {
                height: pageHeight,
                width: pageWidth,
            }
            : {
                height: pageWidth,
                width: pageHeight,
            };
        const pageRect = {
            height: rect.height * scale,
            width: rect.width * scale,
        };
        return layoutBuilder.transformSize
            ? layoutBuilder.transformSize({ numPages, pageIndex, size: pageRect })
            : pageRect;
    }), [rotation, scale, pageSizes]);
    const handleVisibilityChanged = React.useCallback((pageIndex, visibility) => {
        renderQueue.setVisibility(pageIndex, visibility);
    }, []);
    const virtualizer = useVirtual({
        enableSmoothScroll,
        isRtl,
        numberOfItems: numPages,
        parentRef: pagesRef,
        scrollMode,
        setRenderRange,
        sizes,
        viewMode,
        onVisibilityChanged: handleVisibilityChanged,
    });
    const handlePagesResize = useDebounceCallback(() => {
        if (!keepSpecialZoomLevelRef.current ||
            stateRef.current.fullScreenMode !== FullScreenMode.Normal ||
            (initialPage > 0 && forceTargetInitialPageRef.current === initialPage)) {
            return;
        }
        zoom(keepSpecialZoomLevelRef.current);
    }, 200);
    useTrackResize({
        targetRef: pagesRef,
        onResize: handlePagesResize,
    });
    const setViewerState = (viewerState) => {
        let newState = viewerState;
        const transformState = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => transformState(dep));
            }
            if (plugin.onViewerStateChange) {
                newState = plugin.onViewerStateChange(newState);
            }
        };
        plugins.forEach((plugin) => transformState(plugin));
        stateRef.current = newState;
    };
    const getPagesContainer = () => pagesRef.current;
    const getViewerState = () => stateRef.current;
    const jumpToDestination = React.useCallback((destination) => {
        destinationManager.markVisitedDestination(destination);
        return handleJumpToDestination(destination);
    }, []);
    const jumpToNextDestination = React.useCallback(() => {
        const nextDestination = destinationManager.getNextDestination();
        return nextDestination ? handleJumpToDestination(nextDestination) : Promise.resolve();
    }, []);
    const jumpToPreviousDestination = React.useCallback(() => {
        const lastDestination = destinationManager.getPreviousDestination();
        return lastDestination ? handleJumpToDestination(lastDestination) : Promise.resolve();
    }, []);
    const jumpToNextPage = React.useCallback(() => virtualizer.scrollToNextItem(stateRef.current.pageIndex, ZERO_OFFSET), []);
    const jumpToPage = React.useCallback((pageIndex) => 0 <= pageIndex && pageIndex < numPages
        ? new Promise((resolve) => {
            virtualizer.scrollToItem(pageIndex, ZERO_OFFSET).then(() => {
                setRenderPageIndex(pageIndex);
                resolve();
            });
        })
        : Promise.resolve(), []);
    const jumpToPreviousPage = React.useCallback(() => virtualizer.scrollToPreviousItem(stateRef.current.pageIndex, ZERO_OFFSET), []);
    const openFile = React.useCallback((file) => {
        if (getFileExt(file.name).toLowerCase() !== 'pdf') {
            return;
        }
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                const bytes = new Uint8Array(reader.result);
                resolve(bytes);
            };
        }).then((data) => {
            onOpenFile(file.name, data);
        });
    }, [onOpenFile]);
    const normalizeRotation = (rotation) => {
        return rotation < 0 ? 360 + rotation : rotation >= 360 ? rotation - 360 : rotation;
    };
    const rotate = React.useCallback((direction) => {
        const rotation = stateRef.current.rotation;
        const degrees = direction === RotateDirection.Backward ? -90 : 90;
        const finalRotation = normalizeRotation(rotation + degrees);
        renderQueue.markNotRendered();
        setRotation(finalRotation);
        setViewerState(Object.assign(Object.assign({}, stateRef.current), { rotation: finalRotation }));
        onRotate({ direction, doc, rotation: finalRotation });
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);
    const rotatePage = React.useCallback((pageIndex, direction) => {
        const degrees = direction === RotateDirection.Backward ? -90 : 90;
        const rotations = stateRef.current.pagesRotation;
        const currentPageRotation = rotations.has(pageIndex) ? rotations.get(pageIndex) : initialRotation;
        const finalRotation = normalizeRotation(currentPageRotation + degrees);
        const updateRotations = rotations.set(pageIndex, finalRotation);
        setPagesRotationChanged((value) => !value);
        setPagesRotation(updateRotations);
        setViewerState(Object.assign(Object.assign({}, stateRef.current), { pagesRotation: updateRotations, rotatedPage: pageIndex }));
        onRotatePage({
            direction,
            doc,
            pageIndex,
            rotation: finalRotation,
        });
        renderQueue.markRendering(pageIndex);
        setRenderPageIndex(pageIndex);
    }, []);
    const switchScrollMode = React.useCallback((newScrollMode) => {
        renderQueue.markNotRendered();
        setScrollMode(newScrollMode);
        setViewerState(Object.assign(Object.assign({}, stateRef.current), { scrollMode: newScrollMode }));
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);
    const switchViewMode = React.useCallback((newViewMode) => {
        renderQueue.markNotRendered();
        setViewMode(newViewMode);
        setViewerState(Object.assign(Object.assign({}, stateRef.current), { viewMode: newViewMode }));
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);
    const zoom = React.useCallback((newScale) => {
        const pagesEle = pagesRef.current;
        const currentPage = stateRef.current.pageIndex;
        if (currentPage < 0 || currentPage >= numPages) {
            return;
        }
        const currentPageHeight = pageSizes[currentPage].pageHeight;
        const currentPageWidth = pageSizes[currentPage].pageWidth;
        const updateScale = pagesEle
            ? typeof newScale === 'string'
                ? calculateScale(pagesEle, currentPageHeight, currentPageWidth, newScale, stateRef.current.viewMode, numPages)
                : newScale
            : 1;
        keepSpecialZoomLevelRef.current = typeof newScale === 'string' ? newScale : null;
        if (updateScale === stateRef.current.scale) {
            return;
        }
        setRenderQueueKey((key) => key + 1);
        renderQueue.markNotRendered();
        const previousScale = stateRef.current.scale;
        setViewerState(Object.assign(Object.assign({}, stateRef.current), { scale: updateScale }));
        setScale(updateScale);
        onZoom({ doc, scale: updateScale });
        forceTargetPageRef.current = {
            targetPage: currentPage,
            zoomRatio: updateScale / previousScale,
        };
    }, []);
    const enterFullScreenMode = React.useCallback((target) => {
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
        fullScreen.enterFullScreenMode(target);
    }, []);
    const exitFullScreenMode = React.useCallback(() => {
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
        fullScreen.exitFullScreenMode();
    }, []);
    React.useEffect(() => {
        setViewerState(Object.assign(Object.assign({}, stateRef.current), { fullScreenMode: fullScreen.fullScreenMode }));
    }, [fullScreen.fullScreenMode]);
    const handlePageRenderCompleted = React.useCallback((pageIndex) => {
        renderQueue.markRendered(pageIndex);
        if (areSizesCalculated) {
            return;
        }
        const queryPageSizes = Array(doc.numPages)
            .fill(0)
            .map((_, i) => new Promise((resolvePageSize) => {
            getPage(doc, i).then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 1 });
                resolvePageSize({
                    pageHeight: viewport.height,
                    pageWidth: viewport.width,
                    rotation: viewport.rotation,
                });
            });
        }));
        Promise.all(queryPageSizes).then((pageSizes) => {
            setSizesCalculated(true);
            setPageSizes(pageSizes);
            if (initialPage !== 0) {
                jumpToPage(initialPage);
            }
        });
    }, [areSizesCalculated]);
    const handleJumpFromLinkAnnotation = React.useCallback((destination) => {
        destinationManager.markVisitedDestination(destination);
    }, []);
    const handleJumpToDestination = React.useCallback((destination) => {
        const { pageIndex, bottomOffset, leftOffset, scaleTo } = destination;
        const pagesContainer = pagesRef.current;
        const currentState = stateRef.current;
        if (!pagesContainer || !currentState) {
            return Promise.resolve();
        }
        return new Promise((resolve, _) => {
            getPage(doc, pageIndex).then((page) => {
                const viewport = page.getViewport({ scale: 1 });
                let top = 0;
                const bottom = (typeof bottomOffset === 'function'
                    ? bottomOffset(viewport.width, viewport.height)
                    : bottomOffset) || 0;
                let left = (typeof leftOffset === 'function' ? leftOffset(viewport.width, viewport.height) : leftOffset) ||
                    0;
                let updateScale = currentState.scale;
                switch (scaleTo) {
                    case SpecialZoomLevel.PageFit:
                        top = 0;
                        left = 0;
                        zoom(SpecialZoomLevel.PageFit);
                        break;
                    case SpecialZoomLevel.PageWidth:
                        updateScale = calculateScale(pagesContainer, pageSizes[pageIndex].pageHeight, pageSizes[pageIndex].pageWidth, SpecialZoomLevel.PageWidth, viewMode, numPages);
                        top = (viewport.height - bottom) * updateScale;
                        left = left * updateScale;
                        zoom(updateScale);
                        break;
                    default:
                        top = (viewport.height - bottom) * updateScale;
                        left = left * updateScale;
                        break;
                }
                switch (currentState.scrollMode) {
                    case ScrollMode.Horizontal:
                        virtualizer.scrollToItem(pageIndex, { left, top: 0 }).then(() => {
                            resolve();
                        });
                        break;
                    case ScrollMode.Vertical:
                    default:
                        virtualizer.scrollToItem(pageIndex, { left: 0, top }).then(() => {
                            resolve();
                        });
                        break;
                }
            });
        });
    }, [pageSizes]);
    React.useEffect(() => {
        const pluginMethods = {
            enterFullScreenMode,
            exitFullScreenMode,
            getPagesContainer,
            getViewerState,
            jumpToDestination,
            jumpToNextDestination,
            jumpToPreviousDestination,
            jumpToNextPage,
            jumpToPreviousPage,
            jumpToPage,
            openFile,
            rotate,
            rotatePage,
            setViewerState,
            switchScrollMode,
            switchViewMode,
            zoom,
        };
        const installPlugin = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => installPlugin(dep));
            }
            if (plugin.install) {
                plugin.install(pluginMethods);
            }
        };
        const uninstallPlugin = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => uninstallPlugin(dep));
            }
            if (plugin.uninstall) {
                plugin.uninstall(pluginMethods);
            }
        };
        plugins.forEach((plugin) => installPlugin(plugin));
        return () => {
            plugins.forEach((plugin) => uninstallPlugin(plugin));
        };
    }, [docId]);
    React.useEffect(() => {
        const documentLoadProps = { doc, file: currentFile };
        onDocumentLoad(documentLoadProps);
        const handleDocumentLoad = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => handleDocumentLoad(dep));
            }
            if (plugin.onDocumentLoad) {
                plugin.onDocumentLoad(documentLoadProps);
            }
        };
        plugins.forEach((plugin) => handleDocumentLoad(plugin));
    }, [docId]);
    React.useEffect(() => {
        if (fullScreen.fullScreenMode === FullScreenMode.Entered && keepSpecialZoomLevelRef.current) {
            forceTargetZoomRef.current = stateRef.current.pageIndex;
            zoom(keepSpecialZoomLevelRef.current);
        }
    }, [fullScreen.fullScreenMode]);
    const executeNamedAction = (action) => {
        const previousPage = currentPage - 1;
        const nextPage = currentPage + 1;
        switch (action) {
            case 'FirstPage':
                jumpToPage(0);
                break;
            case 'LastPage':
                jumpToPage(numPages - 1);
                break;
            case 'NextPage':
                nextPage < numPages && jumpToPage(nextPage);
                break;
            case 'PrevPage':
                previousPage >= 0 && jumpToPage(previousPage);
                break;
            default:
                break;
        }
    };
    React.useEffect(() => {
        if (fullScreen.fullScreenMode === FullScreenMode.Entering ||
            fullScreen.fullScreenMode === FullScreenMode.Exitting ||
            virtualizer.isSmoothScrolling) {
            return;
        }
        const { startPage, endPage, maxVisbilityIndex } = virtualizer;
        const updateCurrentPage = maxVisbilityIndex;
        const isFullScreen = fullScreen.fullScreenMode === FullScreenMode.Entered;
        if (isFullScreen &&
            updateCurrentPage !== forceTargetPageRef.current.targetPage &&
            forceTargetPageRef.current.targetPage > -1) {
            return;
        }
        if (isFullScreen && updateCurrentPage !== forceTargetZoomRef.current && forceTargetZoomRef.current > -1) {
            return;
        }
        const previousCurrentPage = stateRef.current.pageIndex;
        setCurrentPage(updateCurrentPage);
        setViewerState(Object.assign(Object.assign({}, stateRef.current), { pageIndex: updateCurrentPage }));
        if (updateCurrentPage !== previousCurrentPage && !virtualizer.isSmoothScrolling) {
            onPageChange({ currentPage: updateCurrentPage, doc });
        }
        renderQueue.setRange(startPage, endPage);
    }, [
        virtualizer.startPage,
        virtualizer.endPage,
        virtualizer.isSmoothScrolling,
        virtualizer.maxVisbilityIndex,
        fullScreen.fullScreenMode,
        pagesRotationChanged,
        rotation,
        scale,
    ]);
    const [renderNextPageInQueue] = useAnimationFrame(() => {
        if (stateRef.current.fullScreenMode === FullScreenMode.Entering ||
            stateRef.current.fullScreenMode === FullScreenMode.Exitting) {
            return;
        }
        const { targetPage, zoomRatio } = forceTargetPageRef.current;
        if (targetPage !== -1) {
            const promise = zoomRatio === 1
                ?
                    jumpToPage(targetPage)
                :
                    virtualizer.zoom(zoomRatio, targetPage);
            promise.then(() => {
                forceTargetPageRef.current = {
                    targetPage: -1,
                    zoomRatio: 1,
                };
            });
            return;
        }
        const nextPage = renderQueue.getHighestPriorityPage();
        if (nextPage > -1 && renderQueue.isInRange(nextPage)) {
            renderQueue.markRendering(nextPage);
            setRenderPageIndex(nextPage);
        }
    }, true, []);
    React.useEffect(() => {
        renderNextPageInQueue();
    }, []);
    const renderViewer = () => {
        const { virtualItems } = virtualizer;
        let chunks = [];
        switch (viewMode) {
            case ViewMode.DualPage:
                chunks = chunk(virtualItems, 2);
                break;
            case ViewMode.DualPageWithCover:
                if (virtualItems.length) {
                    chunks =
                        virtualItems[0].index === 0
                            ? [[virtualItems[0]]].concat(chunk(virtualItems.slice(1), 2))
                            : chunk(virtualItems, 2);
                }
                break;
            case ViewMode.SinglePage:
            default:
                chunks = chunk(virtualItems, 1);
                break;
        }
        const pageLabel = l10n && l10n.core ? l10n.core.pageLabel : 'Page {{pageIndex}}';
        let slot = {
            attrs: {
                className: styles.container,
                'data-testid': 'core__inner-container',
                ref: containerRef,
                style: {
                    height: '100%',
                },
            },
            children: React.createElement(React.Fragment, null),
            subSlot: {
                attrs: {
                    'data-testid': 'core__inner-pages',
                    className: classNames({
                        [styles.pages]: true,
                        'rpv-core__inner-pages--horizontal': scrollMode === ScrollMode.Horizontal,
                        [styles.pagesRtl]: isRtl,
                        [styles.pagesSingle]: scrollMode === ScrollMode.Page,
                        'rpv-core__inner-pages--vertical': scrollMode === ScrollMode.Vertical,
                        'rpv-core__inner-pages--wrapped': scrollMode === ScrollMode.Wrapped,
                    }),
                    ref: pagesRef,
                    style: {
                        height: '100%',
                        position: 'relative',
                    },
                },
                children: (React.createElement("div", { "data-testid": `core__inner-current-page-${currentPage}`, style: Object.assign({
                        '--scale-factor': scale,
                    }, virtualizer.getContainerStyles()) }, chunks.map((items) => (React.createElement("div", { className: classNames({
                        [styles.pageContainerSingle]: scrollMode === ScrollMode.Page,
                    }), style: virtualizer.getItemContainerStyles(items[0]), key: `${items[0].index}-${viewMode}-${scrollMode}` }, items.map((item) => {
                    const isCover = viewMode === ViewMode.DualPageWithCover &&
                        (item.index === 0 || (numPages % 2 === 0 && item.index === numPages - 1));
                    return (React.createElement("div", { "aria-label": pageLabel.replace('{{pageIndex}}', `${item.index + 1}`), className: classNames({
                            [styles.pageDualEven]: viewMode === ViewMode.DualPage && item.index % 2 === 0,
                            [styles.pageDualOdd]: viewMode === ViewMode.DualPage && item.index % 2 === 1,
                            [styles.pageDualCover]: isCover,
                            [styles.pageDualCoverEven]: viewMode === ViewMode.DualPageWithCover &&
                                !isCover &&
                                item.index % 2 === 0,
                            [styles.pageDualCoverOdd]: viewMode === ViewMode.DualPageWithCover &&
                                !isCover &&
                                item.index % 2 === 1,
                            [styles.pageSingle]: viewMode === ViewMode.SinglePage && scrollMode === ScrollMode.Page,
                        }), role: "region", key: `${item.index}-${viewMode}`, style: Object.assign({}, virtualizer.getItemStyles(item), layoutBuilder.buildPageStyles
                            ? layoutBuilder.buildPageStyles({
                                numPages,
                                pageIndex: item.index,
                                scrollMode,
                                viewMode,
                            })
                            : {}) },
                        React.createElement(PageLayer, { doc: doc, measureRef: item.measureRef, outlines: outlines, pageIndex: item.index, pageRotation: pagesRotation.has(item.index) ? pagesRotation.get(item.index) : 0, pageSize: pageSizes[item.index], plugins: plugins, renderPage: renderPage, renderQueueKey: renderQueueKey, rotation: rotation, scale: scale, shouldRender: renderPageIndex === item.index, viewMode: viewMode, onExecuteNamedAction: executeNamedAction, onJumpFromLinkAnnotation: handleJumpFromLinkAnnotation, onJumpToDest: jumpToDestination, onRenderCompleted: handlePageRenderCompleted, onRotatePage: rotatePage })));
                })))))),
            },
        };
        const renderViewerProps = {
            containerRef,
            doc,
            pagesContainerRef: pagesRef,
            pagesRotation,
            pageSizes,
            rotation,
            slot,
            themeContext,
            jumpToPage,
            openFile,
            rotate,
            rotatePage,
            switchScrollMode,
            switchViewMode,
            zoom,
        };
        const transformSlot = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => transformSlot(dep));
            }
            if (plugin.renderViewer) {
                slot = plugin.renderViewer(Object.assign(Object.assign({}, renderViewerProps), { slot }));
            }
        };
        plugins.forEach((plugin) => transformSlot(plugin));
        return slot;
    };
    const renderSlot = React.useCallback((slot) => (React.createElement("div", Object.assign({}, slot.attrs, { style: slot.attrs && slot.attrs.style ? slot.attrs.style : {} }),
        slot.children,
        slot.subSlot && renderSlot(slot.subSlot))), []);
    return renderSlot(renderViewer());
};
