'use client';
import * as React from 'react';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { usePrevious } from './hooks/usePrevious';
import { Inner } from './layouts/Inner';
import { PageSizeCalculator } from './layouts/PageSizeCalculator';
import { DocumentLoader } from './loader/DocumentLoader';
import { StackContext } from './portal/StackContext';
import { BreakpointContext } from './responsive/BreakpointContext';
import { useBreakpoint } from './responsive/useBreakpoint';
import { FullScreenMode } from './structs/FullScreenMode';
import { ScrollMode } from './structs/ScrollMode';
import { ViewMode } from './structs/ViewMode';
import styles from './styles/viewer.module.css';
import { ThemeContext } from './theme/ThemeContext';
import { isSameUrl } from './utils/isSameUrl';
import { mergeRefs } from './utils/mergeRefs';
const NUM_OVERSCAN_PAGES = 3;
const DEFAULT_RENDER_RANGE = (visiblePagesRange) => {
    return {
        startPage: visiblePagesRange.startPage - NUM_OVERSCAN_PAGES,
        endPage: visiblePagesRange.endPage + NUM_OVERSCAN_PAGES,
    };
};
export const Viewer = ({ characterMap, defaultScale, enableSmoothScroll = true, fileUrl, httpHeaders = {}, initialPage = 0, pageLayout, initialRotation = 0, plugins = [], renderError, renderLoader, renderPage, renderProtectedView, scrollMode = ScrollMode.Vertical, setRenderRange = DEFAULT_RENDER_RANGE, transformGetDocumentParams, viewMode = ViewMode.SinglePage, withCredentials = false, onDocumentAskPassword, onDocumentLoad = () => {
}, onPageChange = () => {
}, onRotate = () => {
}, onRotatePage = () => {
}, onSwitchTheme = () => {
}, onZoom = () => {
}, }) => {
    const [file, setFile] = React.useState({
        data: fileUrl,
        name: typeof fileUrl === 'string' ? fileUrl : '',
        shouldLoad: false,
    });
    const openFile = (fileName, data) => {
        setFile({
            data,
            name: fileName,
            shouldLoad: true,
        });
    };
    const [visible, setVisible] = React.useState(false);
    const prevFile = usePrevious(file);
    React.useEffect(() => {
        if (!isSameUrl(prevFile.data, fileUrl)) {
            setFile({
                data: fileUrl,
                name: typeof fileUrl === 'string' ? fileUrl : '',
                shouldLoad: visible,
            });
        }
    }, [fileUrl, visible]);
    const visibilityChanged = (params) => {
        setVisible(params.isVisible);
        if (params.isVisible) {
            setFile((currentFile) => Object.assign({}, currentFile, { shouldLoad: true }));
        }
    };
    const trackIntersectionRef = useIntersectionObserver({
        onVisibilityChanged: visibilityChanged,
    });
    const [trackBreakpointRef, breakpoint] = useBreakpoint();
    const containerRef = mergeRefs([trackIntersectionRef, trackBreakpointRef]);
    const { currentTheme } = React.useContext(ThemeContext);
    const prevTheme = usePrevious(currentTheme);
    const [numStacks, setNumStacks] = React.useState(0);
    const increaseNumStacks = () => setNumStacks((v) => v + 1);
    const decreaseNumStacks = () => setNumStacks((v) => v - 1);
    React.useEffect(() => {
        if (currentTheme !== prevTheme && onSwitchTheme) {
            onSwitchTheme(currentTheme);
        }
    }, [currentTheme]);
    return (React.createElement(StackContext.Provider, { value: { currentIndex: 0, increaseNumStacks, decreaseNumStacks, numStacks } },
        React.createElement(BreakpointContext.Provider, { value: breakpoint },
            React.createElement("div", { ref: containerRef, className: styles.viewer, "data-testid": "core__viewer", style: {
                    height: '100%',
                    width: '100%',
                } }, file.shouldLoad && (React.createElement(DocumentLoader, { characterMap: characterMap, file: file.data, httpHeaders: httpHeaders, render: (doc) => (React.createElement(PageSizeCalculator, { defaultScale: defaultScale, doc: doc, render: (estimatedPageSizes, initialScale) => (React.createElement(Inner, { currentFile: {
                            data: file.data,
                            name: file.name,
                        }, defaultScale: defaultScale, doc: doc, enableSmoothScroll: enableSmoothScroll, estimatedPageSizes: estimatedPageSizes, initialPage: initialPage, initialRotation: initialRotation, initialScale: initialScale, initialScrollMode: scrollMode, initialViewMode: viewMode, pageLayout: pageLayout, plugins: plugins, renderPage: renderPage, setRenderRange: setRenderRange, viewerState: {
                            file,
                            fullScreenMode: FullScreenMode.Normal,
                            pageIndex: -1,
                            pageHeight: estimatedPageSizes[0].pageHeight,
                            pageWidth: estimatedPageSizes[0].pageWidth,
                            pagesRotation: new Map(),
                            rotation: initialRotation,
                            scale: initialScale,
                            scrollMode,
                            viewMode,
                        }, onDocumentLoad: onDocumentLoad, onOpenFile: openFile, onPageChange: onPageChange, onRotate: onRotate, onRotatePage: onRotatePage, onZoom: onZoom })), scrollMode: scrollMode, viewMode: viewMode })), renderError: renderError, renderLoader: renderLoader, renderProtectedView: renderProtectedView, transformGetDocumentParams: transformGetDocumentParams, withCredentials: withCredentials, onDocumentAskPassword: onDocumentAskPassword }))))));
};
