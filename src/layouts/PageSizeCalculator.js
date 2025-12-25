'use client';
import * as React from 'react';
import { Spinner } from '../components/Spinner';
import { ScrollMode } from '../structs/ScrollMode';
import styles from '../styles/pageSizeCalculator.module.css';
import { getPage } from '../utils/managePages';
import { decrease } from '../zoom/zoomingLevel';
import { calculateScale } from './calculateScale';
const RESERVE_HEIGHT = 45;
const RESERVE_WIDTH = 45;
export const PageSizeCalculator = ({ defaultScale, doc, render, scrollMode, viewMode }) => {
    const pagesRef = React.useRef(null);
    const [state, setState] = React.useState({
        estimatedPageSizes: [],
        scale: 0,
    });
    React.useLayoutEffect(() => {
        getPage(doc, 0).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });
            const pagesEle = pagesRef.current;
            if (!pagesEle) {
                return;
            }
            const w = viewport.width;
            const h = viewport.height;
            const parentEle = pagesEle.parentElement;
            if (!parentEle) {
                return;
            }
            const scaleWidth = (parentEle.clientWidth - RESERVE_WIDTH) / w;
            const scaleHeight = (parentEle.clientHeight - RESERVE_HEIGHT) / h;
            let scaled = scaleWidth;
            switch (scrollMode) {
                case ScrollMode.Horizontal:
                    scaled = Math.min(scaleWidth, scaleHeight);
                    break;
                case ScrollMode.Vertical:
                default:
                    scaled = scaleWidth;
                    break;
            }
            const scale = defaultScale
                ? typeof defaultScale === 'string'
                    ? calculateScale(parentEle, h, w, defaultScale, viewMode, doc.numPages)
                    : defaultScale
                : decrease(scaled);
            const estimatedPageSizes = Array(doc.numPages)
                .fill(0)
                .map((_) => ({
                pageHeight: viewport.height,
                pageWidth: viewport.width,
                rotation: viewport.rotation,
            }));
            setState({ estimatedPageSizes, scale });
        });
    }, [doc.loadingTask.docId]);
    return state.estimatedPageSizes.length === 0 || state.scale === 0 ? (React.createElement("div", { className: styles.container, "data-testid": "core__page-size-calculating", ref: pagesRef },
        React.createElement(Spinner, null))) : (render(state.estimatedPageSizes, state.scale));
};
