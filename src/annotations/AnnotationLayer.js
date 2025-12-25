'use client';
import * as React from 'react';
import { AnnotationLayerBody } from './AnnotationLayerBody';
import { AnnotationLoader } from './AnnotationLoader';
export const AnnotationLayer = ({ doc, outlines, page, pageIndex, plugins, rotation, scale, onExecuteNamedAction, onJumpFromLinkAnnotation, onJumpToDest, }) => {
    const renderAnnotations = (annotations) => (React.createElement(AnnotationLayerBody, { annotations: annotations, doc: doc, outlines: outlines, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotation, scale: scale, onExecuteNamedAction: onExecuteNamedAction, onJumpFromLinkAnnotation: onJumpFromLinkAnnotation, onJumpToDest: onJumpToDest }));
    return React.createElement(AnnotationLoader, { page: page, renderAnnotations: renderAnnotations });
};
