'use client';
import * as React from 'react';
import { AnnotationBorderStyleType } from './AnnotationBorderStyleType';
import { PopupWrapper } from './PopupWrapper';
import { useTogglePopup } from './useTogglePopup';
export const Annotation = ({ annotation, children, ignoreBorder, hasPopup, isRenderable, page, viewport }) => {
    const { rect } = annotation;
    const { closeOnHover, opened, openOnHover, toggleOnClick } = useTogglePopup();
    const normalizeRect = (r) => [
        Math.min(r[0], r[2]),
        Math.min(r[1], r[3]),
        Math.max(r[0], r[2]),
        Math.max(r[1], r[3]),
    ];
    const bound = normalizeRect([
        rect[0],
        page.view[3] + page.view[1] - rect[1],
        rect[2],
        page.view[3] + page.view[1] - rect[3],
    ]);
    let width = rect[2] - rect[0];
    let height = rect[3] - rect[1];
    let styles = {
        borderColor: '',
        borderRadius: '',
        borderStyle: '',
        borderWidth: '',
    };
    if (!ignoreBorder && annotation.borderStyle.width > 0) {
        switch (annotation.borderStyle.style) {
            case AnnotationBorderStyleType.Dashed:
                styles.borderStyle = 'dashed';
                break;
            case AnnotationBorderStyleType.Solid:
                styles.borderStyle = 'solid';
                break;
            case AnnotationBorderStyleType.Underline:
                styles = Object.assign({
                    borderBottomStyle: 'solid',
                }, styles);
                break;
            case AnnotationBorderStyleType.Beveled:
            case AnnotationBorderStyleType.Inset:
            default:
                break;
        }
        const borderWidth = annotation.borderStyle.width;
        styles.borderWidth = `${borderWidth}px`;
        if (annotation.borderStyle.style !== AnnotationBorderStyleType.Underline) {
            width = width - 2 * borderWidth;
            height = height - 2 * borderWidth;
        }
        const { horizontalCornerRadius, verticalCornerRadius } = annotation.borderStyle;
        if (horizontalCornerRadius > 0 || verticalCornerRadius > 0) {
            styles.borderRadius = `${horizontalCornerRadius}px / ${verticalCornerRadius}px`;
        }
        annotation.color
            ? (styles.borderColor = `rgb(${annotation.color[0] | 0}, ${annotation.color[1] | 0}, ${annotation.color[2] | 0})`)
            :
                (styles.borderWidth = '0');
    }
    return (React.createElement(React.Fragment, null, isRenderable &&
        children({
            popup: {
                opened,
                closeOnHover,
                openOnHover,
                toggleOnClick,
            },
            slot: {
                attrs: {
                    style: Object.assign({
                        height: `${height}px`,
                        left: `${bound[0]}px`,
                        top: `${bound[1]}px`,
                        transform: `matrix(${viewport.transform.join(',')})`,
                        transformOrigin: `-${bound[0]}px -${bound[1]}px`,
                        width: `${width}px`,
                    }, styles),
                },
                children: React.createElement(React.Fragment, null, hasPopup && opened && React.createElement(PopupWrapper, { annotation: annotation })),
            },
        })));
};
