'use client';
import * as React from 'react';
import { AnnotationLayer } from '../annotations/AnnotationLayer';
import { Spinner } from '../components/Spinner';
import { useIsMounted } from '../hooks/useIsMounted';
import { useSafeState } from '../hooks/useSafeState';
import { ViewMode } from '../structs/ViewMode';
import styles from '../styles/pageLayer.module.css';
import { classNames } from '../utils/classNames';
import { getPage } from '../utils/managePages';
import { CanvasLayer } from './CanvasLayer';
import { SvgLayer } from './SvgLayer';
import { TextLayer } from './TextLayer';
export const PageLayer = ({ doc, measureRef, outlines, pageIndex, pageRotation, pageSize, plugins, renderPage, renderQueueKey, rotation, scale, shouldRender, viewMode, onExecuteNamedAction, onJumpFromLinkAnnotation, onJumpToDest, onRenderCompleted, onRotatePage, }) => {
    const isMountedRef = useIsMounted();
    const [page, setPage] = useSafeState(null);
    const [canvasLayerRendered, setCanvasLayerRendered] = useSafeState(false);
    const [textLayerRendered, setTextLayerRendered] = useSafeState(false);
    const canvasLayerRef = React.useRef(null);
    const textLayerRef = React.useRef(null);
    const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;
    const scaledWidth = pageSize.pageWidth * scale;
    const scaledHeight = pageSize.pageHeight * scale;
    const w = isVertical ? scaledWidth : scaledHeight;
    const h = isVertical ? scaledHeight : scaledWidth;
    const rotationValue = (pageSize.rotation + rotation + pageRotation) % 360;
    const renderQueueKeyRef = React.useRef(0);
    const determinePageInstance = () => {
        getPage(doc, pageIndex).then((pdfPage) => {
            renderQueueKeyRef.current = renderQueueKey;
            setPage(pdfPage);
        });
    };
    const defaultPageRenderer = (props) => (React.createElement(React.Fragment, null,
        props.canvasLayer.children,
        props.textLayer.children,
        props.annotationLayer.children));
    const renderPageLayer = renderPage || defaultPageRenderer;
    const handleRenderCanvasCompleted = () => {
        setCanvasLayerRendered(true);
    };
    const handleRenderTextCompleted = () => {
        setTextLayerRendered(true);
    };
    const renderPluginsLayer = (plugins) => plugins.map((plugin, idx) => (React.createElement(React.Fragment, { key: idx },
        plugin.dependencies && renderPluginsLayer(plugin.dependencies),
        plugin.renderPageLayer &&
            plugin.renderPageLayer({
                canvasLayerRef,
                canvasLayerRendered,
                doc,
                height: h,
                pageIndex,
                rotation: rotationValue,
                scale,
                textLayerRef,
                textLayerRendered,
                width: w,
            }))));
    React.useEffect(() => {
        setPage(null);
        setCanvasLayerRendered(false);
        setTextLayerRendered(false);
    }, [pageRotation, rotation, scale]);
    React.useEffect(() => {
        if (shouldRender && isMountedRef.current && !page) {
            determinePageInstance();
        }
    }, [shouldRender, page]);
    React.useEffect(() => {
        if (canvasLayerRendered && textLayerRendered) {
            if (renderQueueKey !== renderQueueKeyRef.current) {
                setPage(null);
                setCanvasLayerRendered(false);
                setTextLayerRendered(false);
            }
            else {
                onRenderCompleted(pageIndex);
            }
        }
    }, [canvasLayerRendered, textLayerRendered]);
    return (React.createElement("div", { className: classNames({
            [styles.layer]: true,
            [styles.layerSingle]: viewMode === ViewMode.SinglePage,
        }), "data-testid": `core__page-layer-${pageIndex}`, ref: measureRef, style: {
            height: `${h}px`,
            width: `${w}px`,
        } }, !page ? (React.createElement(Spinner, { testId: `core__page-layer-loading-${pageIndex}` })) : (React.createElement(React.Fragment, null,
        renderPageLayer({
            annotationLayer: {
                attrs: {},
                children: (React.createElement(AnnotationLayer, { doc: doc, outlines: outlines, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotationValue, scale: scale, onExecuteNamedAction: onExecuteNamedAction, onJumpFromLinkAnnotation: onJumpFromLinkAnnotation, onJumpToDest: onJumpToDest })),
            },
            canvasLayer: {
                attrs: {},
                children: (React.createElement(CanvasLayer, { canvasLayerRef: canvasLayerRef, height: h, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotationValue, scale: scale, width: w, onRenderCanvasCompleted: handleRenderCanvasCompleted })),
            },
            canvasLayerRendered,
            doc,
            height: h,
            pageIndex,
            rotation: rotationValue,
            scale,
            svgLayer: {
                attrs: {},
                children: (React.createElement(SvgLayer, { height: h, page: page, rotation: rotationValue, scale: scale, width: w })),
            },
            textLayer: {
                attrs: {},
                children: (React.createElement(TextLayer, { containerRef: textLayerRef, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotationValue, scale: scale, onRenderTextCompleted: handleRenderTextCompleted })),
            },
            textLayerRendered,
            width: w,
            markRendered: onRenderCompleted,
            onRotatePage: (direction) => onRotatePage(pageIndex, direction),
        }),
        renderPluginsLayer(plugins)))));
};
