'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import styles from '../styles/annotationLayer.module.css';
import { AnnotationType } from './AnnotationType';
import { Caret } from './Caret';
import { Circle } from './Circle';
import { FileAttachment } from './FileAttachment';
import { FreeText } from './FreeText';
import { Highlight } from './Highlight';
import { Ink } from './Ink';
import { Line } from './Line';
import { Link } from './Link';
import { Polygon } from './Polygon';
import { Polyline } from './Polyline';
import { Popup } from './Popup';
import { Square } from './Square';
import { Squiggly } from './Squiggly';
import { Stamp } from './Stamp';
import { StrikeOut } from './StrikeOut';
import { Text } from './Text';
import { Underline } from './Underline';
export const AnnotationLayerBody = ({ annotations, doc, outlines, page, pageIndex, plugins, rotation, scale, onExecuteNamedAction, onJumpFromLinkAnnotation, onJumpToDest, }) => {
    const containerRef = React.useRef(null);
    const viewport = page.getViewport({ rotation, scale });
    const clonedViewPort = viewport.clone({ dontFlip: true });
    const filterAnnotations = annotations.filter((annotation) => !annotation.parentId);
    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const renderProps = {
            annotations: filterAnnotations,
            container,
            pageIndex,
            rotation,
            scale,
        };
        const handleRenderAnnotationLayer = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => {
                    handleRenderAnnotationLayer(dep);
                });
            }
            if (plugin.onAnnotationLayerRender) {
                plugin.onAnnotationLayerRender(renderProps);
            }
        };
        plugins.forEach((plugin) => {
            handleRenderAnnotationLayer(plugin);
        });
    }, []);
    return (React.createElement("div", { ref: containerRef, className: styles.layer, "data-testid": `core__annotation-layer-${pageIndex}` }, filterAnnotations.map((annotation) => {
        const childAnnotation = annotations.find((item) => item.parentId === annotation.id);
        switch (annotation.annotationType) {
            case AnnotationType.Caret:
                return (React.createElement(Caret, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Circle:
                return (React.createElement(Circle, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.FileAttachment:
                return (React.createElement(FileAttachment, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.FreeText:
                return (React.createElement(FreeText, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Highlight:
                return (React.createElement(Highlight, { key: annotation.id, annotation: annotation, childAnnotation: childAnnotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Ink:
                return (React.createElement(Ink, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Line:
                return (React.createElement(Line, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Link:
                return (React.createElement(Link, { key: annotation.id, annotation: annotation, annotationContainerRef: containerRef, doc: doc, outlines: outlines, page: page, pageIndex: pageIndex, scale: scale, viewport: clonedViewPort, onExecuteNamedAction: onExecuteNamedAction, onJumpFromLinkAnnotation: onJumpFromLinkAnnotation, onJumpToDest: onJumpToDest }));
            case AnnotationType.Polygon:
                return (React.createElement(Polygon, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Polyline:
                return (React.createElement(Polyline, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Popup:
                return (React.createElement(Popup, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Square:
                return (React.createElement(Square, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Squiggly:
                return (React.createElement(Squiggly, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Stamp:
                return (React.createElement(Stamp, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.StrikeOut:
                return (React.createElement(StrikeOut, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Text:
                return (React.createElement(Text, { key: annotation.id, annotation: annotation, childAnnotation: childAnnotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Underline:
                return (React.createElement(Underline, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            default:
                return React.createElement(React.Fragment, { key: annotation.id });
        }
    })));
};
