'use client';
import * as React from 'react';
import styles from '../styles/annotation.module.css';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { Annotation } from './Annotation';
import { PopupWrapper } from './PopupWrapper';
import { getContents } from './getContents';
import { getTitle } from './getTitle';
export const Popup = ({ annotation, page, viewport }) => {
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const isRenderable = !!(title || contents);
    const ignoredParents = ['Circle', 'Ink', 'Line', 'Polygon', 'PolyLine', 'Square'];
    const hasPopup = !annotation.parentType || ignoredParents.indexOf(annotation.parentType) !== -1;
    useIsomorphicLayoutEffect(() => {
        if (!annotation.parentId) {
            return;
        }
        const parent = document.querySelector(`[data-annotation-id="${annotation.parentId}"]`);
        const container = document.querySelector(`[data-annotation-id="${annotation.id}"]`);
        if (!parent || !container) {
            return;
        }
        const left = parseFloat(parent.style.left);
        const top = parseFloat(parent.style.top) + parseFloat(parent.style.height);
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
        container.style.transformOrigin = `-${left}px -${top}px`;
    }, []);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: false, isRenderable: isRenderable, page: page, viewport: viewport }, (props) => (React.createElement("div", Object.assign({}, props.slot.attrs, { className: styles.annotation, "data-annotation-id": annotation.id, "data-annotation-type": "popup" }),
        React.createElement(PopupWrapper, { annotation: annotation })))));
};
