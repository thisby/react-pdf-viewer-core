'use client';
import * as React from 'react';
import styles from '../styles/annotation.module.css';
import { downloadFile } from '../utils/downloadFile';
import { Annotation } from './Annotation';
import { getContents } from './getContents';
import { getTitle } from './getTitle';
export const FileAttachment = ({ annotation, page, viewport }) => {
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const hasPopup = annotation.hasPopup === false && (!!title || !!contents);
    const doubleClick = () => {
        const file = annotation.file;
        file && downloadFile(file.filename, file.content);
    };
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: true, page: page, viewport: viewport }, (props) => (React.createElement("div", Object.assign({}, props.slot.attrs, { className: styles.annotation, "data-annotation-id": annotation.id, "data-annotation-type": "attachment", onClick: props.popup.toggleOnClick, onDoubleClick: doubleClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children))));
};
