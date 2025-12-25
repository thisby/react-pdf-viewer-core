'use client';
import * as React from 'react';
import styles from '../styles/annotation.module.css';
import { getDestination } from '../utils/managePages';
import { sanitizeUrl } from '../utils/sanitizeUrl';
import { Annotation } from './Annotation';
export const Link = ({ annotation, annotationContainerRef, doc, outlines, page, pageIndex, scale, viewport, onExecuteNamedAction, onJumpFromLinkAnnotation, onJumpToDest, }) => {
    var _a;
    const elementRef = React.useRef(null);
    const title = outlines && outlines.length && annotation.dest && typeof annotation.dest === 'string'
        ? (_a = outlines.find((item) => item.dest === annotation.dest)) === null || _a === void 0 ? void 0 : _a.title
        : '';
    const link = (e) => {
        e.preventDefault();
        annotation.action
            ? onExecuteNamedAction(annotation.action)
            : getDestination(doc, annotation.dest).then((target) => {
                const element = elementRef.current;
                const annotationContainer = annotationContainerRef.current;
                if (element && annotationContainer) {
                    const linkRect = element.getBoundingClientRect();
                    annotationContainer.style.setProperty('height', '100%');
                    annotationContainer.style.setProperty('width', '100%');
                    const annotationLayerRect = annotationContainer.getBoundingClientRect();
                    annotationContainer.style.removeProperty('height');
                    annotationContainer.style.removeProperty('width');
                    const leftOffset = (linkRect.left - annotationLayerRect.left) / scale;
                    const bottomOffset = (annotationLayerRect.bottom - linkRect.bottom + linkRect.height) / scale;
                    onJumpFromLinkAnnotation({
                        bottomOffset,
                        label: title,
                        leftOffset,
                        pageIndex,
                    });
                }
                onJumpToDest(target);
            });
    };
    let isRenderable = !!(annotation.url || annotation.dest || annotation.action || annotation.unsafeUrl);
    let attrs = {};
    if (annotation.url || annotation.unsafeUrl) {
        const targetUrl = sanitizeUrl(annotation.url || annotation.unsafeUrl || '', '');
        if (targetUrl) {
            attrs = {
                'data-target': 'external',
                href: targetUrl,
                rel: 'noopener noreferrer nofollow',
                target: annotation.newWindow ? '_blank' : '',
                title: targetUrl,
            };
        }
        else {
            isRenderable = false;
        }
    }
    else {
        attrs = {
            href: '',
            'data-annotation-link': annotation.id,
            onClick: link,
        };
    }
    if (title) {
        attrs = Object.assign({}, attrs, {
            title,
            'aria-label': title,
        });
    }
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: false, ignoreBorder: false, isRenderable: isRenderable, page: page, viewport: viewport }, (props) => (React.createElement("div", Object.assign({}, props.slot.attrs, { className: styles.annotation, "data-annotation-id": annotation.id, "data-annotation-type": "link", "data-testid": `core__annotation--link-${annotation.id}` }),
        React.createElement("a", Object.assign({ className: styles.link, ref: elementRef }, attrs))))));
};
