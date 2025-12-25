'use client';
import * as React from 'react';
import styles from '../styles/annotation.module.css';
import { CheckIcon } from '../icons/CheckIcon';
import { CommentIcon } from '../icons/CommentIcon';
import { HelpIcon } from '../icons/HelpIcon';
import { KeyIcon } from '../icons/KeyIcon';
import { NoteIcon } from '../icons/NoteIcon';
import { ParagraphIcon } from '../icons/ParagraphIcon';
import { TriangleIcon } from '../icons/TriangleIcon';
import { Annotation } from './Annotation';
import { AnnotationType } from './AnnotationType';
import { Popup } from './Popup';
import { getContents } from './getContents';
import { getTitle } from './getTitle';
export const Text = ({ annotation, childAnnotation, page, viewport }) => {
    const hasPopup = annotation.hasPopup === false;
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const isRenderable = !!(annotation.hasPopup || title || contents);
    const name = annotation.name ? annotation.name.toLowerCase() : '';
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: false, isRenderable: isRenderable, page: page, viewport: viewport }, (props) => (React.createElement(React.Fragment, null,
        React.createElement("div", Object.assign({}, props.slot.attrs, { className: styles.annotation, "data-annotation-id": annotation.id, "data-annotation-type": "text", onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
            name && (React.createElement("div", { className: "rpv-core__annotation-text-icon" },
                name === 'check' && React.createElement(CheckIcon, null),
                name === 'comment' && React.createElement(CommentIcon, null),
                name === 'help' && React.createElement(HelpIcon, null),
                name === 'insert' && React.createElement(TriangleIcon, null),
                name === 'key' && React.createElement(KeyIcon, null),
                name === 'note' && React.createElement(NoteIcon, null),
                (name === 'newparagraph' || name === 'paragraph') && React.createElement(ParagraphIcon, null))),
            props.slot.children),
        childAnnotation &&
            childAnnotation.annotationType === AnnotationType.Popup &&
            props.popup.opened && React.createElement(Popup, { annotation: childAnnotation, page: page, viewport: viewport })))));
};
