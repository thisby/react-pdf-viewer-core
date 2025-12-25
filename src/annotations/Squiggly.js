'use client';
import * as React from 'react';
import styles from '../styles/annotation.module.css';
import { Annotation } from './Annotation';
import { getContents } from './getContents';
import { getTitle } from './getTitle';
export const Squiggly = ({ annotation, page, viewport }) => {
    const hasPopup = annotation.hasPopup === false;
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const isRenderable = !!(annotation.hasPopup || title || contents);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, (props) => (React.createElement("div", Object.assign({}, props.slot.attrs, { className: styles.annotation, "data-annotation-id": annotation.id, "data-annotation-type": "squiggly", onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children))));
};
