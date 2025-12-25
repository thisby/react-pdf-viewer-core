'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { PdfJsApiContext } from '../vendors/PdfJsApiContext';
export const SvgLayer = ({ height, page, rotation, scale, width }) => {
    const { pdfJsApiProvider } = React.useContext(PdfJsApiContext);
    const containerRef = React.useRef(null);
    const empty = () => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        containerEle.innerHTML = '';
    };
    useIsomorphicLayoutEffect(() => {
        const containerEle = containerRef.current;
        if (!pdfJsApiProvider || !containerEle) {
            return;
        }
        const viewport = page.getViewport({ rotation, scale });
        page.getOperatorList().then((operatorList) => {
            empty();
            const graphic = new pdfJsApiProvider.SVGGraphics(page.commonObjs, page.objs);
            graphic.getSVG(operatorList, viewport).then((svg) => {
                svg.style.height = `${height}px`;
                svg.style.width = `${width}px`;
                containerEle.appendChild(svg);
            });
        });
    }, []);
    return React.createElement("div", { className: "rpv-core__svg-layer", ref: containerRef });
};
