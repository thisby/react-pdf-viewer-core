'use client';
import * as React from 'react';
import styles from '../styles/annotation.module.css';
import { Annotation } from './Annotation';
import { AnnotationType } from './AnnotationType';
import { Popup } from './Popup';
import { getContents } from './getContents';
import { getTitle } from './getTitle';
export const Highlight = ({ annotation, childAnnotation, page, viewport }) => {
    const hasPopup = annotation.hasPopup === false;
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const isRenderable = !!(annotation.hasPopup || title || contents);
    if (annotation.quadPoints && annotation.quadPoints.length > 0) {
        const annotations = annotation.quadPoints.map((quadPoint) => Object.assign({}, annotation, {
            rect: [quadPoint[2].x, quadPoint[2].y, quadPoint[1].x, quadPoint[1].y],
            quadPoints: [],
        }));
        return (React.createElement(React.Fragment, null, annotations.map((ann, index) => (React.createElement(Highlight, { key: index, annotation: ann, childAnnotation: childAnnotation, page: page, viewport: viewport })))));
    }
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, (props) => (React.createElement(React.Fragment, null,
        React.createElement("div", Object.assign({}, props.slot.attrs, { className: styles.annotation, "data-annotation-id": annotation.id, "data-annotation-type": "highlight", onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children),
        childAnnotation &&
            childAnnotation.annotationType === AnnotationType.Popup &&
            props.popup.opened && React.createElement(Popup, { annotation: childAnnotation, page: page, viewport: viewport })))));
};
