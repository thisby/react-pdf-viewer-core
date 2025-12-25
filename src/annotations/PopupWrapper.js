'use client';
import * as React from 'react';
import styles from '../styles/annotationPopup.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import { convertDate } from '../utils/convertDate';
import { AnnotationType } from './AnnotationType';
import { getContents } from './getContents';
import { getTitle } from './getTitle';
export const PopupWrapper = ({ annotation }) => {
    const { direction } = React.useContext(ThemeContext);
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const isRtl = direction === TextDirection.RightToLeft;
    const containerRef = React.useRef(null);
    let dateStr = '';
    if (annotation.modificationDate) {
        const date = convertDate(annotation.modificationDate);
        dateStr = date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : '';
    }
    React.useLayoutEffect(() => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        const annotationEle = document.querySelector(`[data-annotation-id="${annotation.id}"]`);
        if (!annotationEle) {
            return;
        }
        const ele = annotationEle;
        ele.style.zIndex += 1;
        return () => {
            ele.style.zIndex = `${parseInt(ele.style.zIndex, 10) - 1}`;
        };
    }, []);
    return (React.createElement("div", { ref: containerRef, className: classNames({
            [styles.wrapper]: true,
            [styles.wrapperRtl]: isRtl,
        }), style: {
            top: annotation.annotationType === AnnotationType.Popup ? '' : '100%',
        } },
        title && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: classNames({
                    [styles.title]: true,
                }) }, title),
            React.createElement("div", { className: styles.date }, dateStr))),
        contents && (React.createElement("div", { className: styles.content }, contents.split('\n').map((item, index) => (React.createElement(React.Fragment, { key: index },
            item,
            React.createElement("br", null))))))));
};
