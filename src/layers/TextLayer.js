'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { LayerRenderStatus } from '../structs/LayerRenderStatus';
import styles from '../styles/textLayer.module.css';
import { PdfJsApiContext } from '../vendors/PdfJsApiContext';
export const TextLayer = ({ containerRef, page, pageIndex, plugins, rotation, scale, onRenderTextCompleted }) => {
    const { pdfJsApiProvider } = React.useContext(PdfJsApiContext);
    const renderTaskRef = React.useRef();
    const empty = () => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        const spans = [].slice.call(containerEle.querySelectorAll(`.${styles.text}`));
        spans.forEach((span) => containerEle.removeChild(span));
        const breaks = [].slice.call(containerEle.querySelectorAll('br[role="presentation"]'));
        breaks.forEach((br) => containerEle.removeChild(br));
    };
    useIsomorphicLayoutEffect(() => {
        const task = renderTaskRef.current;
        if (task) {
            task.cancel();
        }
        const containerEle = containerRef.current;
        if (!containerEle || !pdfJsApiProvider) {
            return;
        }
        containerEle.removeAttribute('data-testid');
        const viewport = page.getViewport({ rotation, scale });
        const preRenderProps = {
            ele: containerEle,
            pageIndex,
            scale,
            status: LayerRenderStatus.PreRender,
        };
        const handlePreRenderTextLayer = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => handlePreRenderTextLayer(dep));
            }
            if (plugin.onTextLayerRender) {
                plugin.onTextLayerRender(preRenderProps);
            }
        };
        plugins.forEach((plugin) => handlePreRenderTextLayer(plugin));
        page.getTextContent().then((textContent) => {
            empty();
            containerEle.style.setProperty('--scale-factor', `${scale}`);
            renderTaskRef.current = new pdfJsApiProvider.TextLayer({
                container: containerEle,
                textContentSource: textContent,
                viewport: viewport,
            });
            renderTaskRef.current.render().then(() => {
                containerEle.setAttribute('data-testid', `core__text-layer-${pageIndex}`);
                containerEle.removeAttribute('data-main-rotation');
                const spans = [].slice.call(containerEle.children);
                spans.forEach((span) => {
                    if (span.getAttribute('data-text') !== 'true') {
                        span.classList.add(styles.text);
                        span.setAttribute('data-text', 'true');
                    }
                });
                const didRenderProps = {
                    ele: containerEle,
                    pageIndex,
                    scale,
                    status: LayerRenderStatus.DidRender,
                };
                const handleDidRenderTextLayer = (plugin) => {
                    if (plugin.dependencies) {
                        plugin.dependencies.forEach((dep) => handleDidRenderTextLayer(dep));
                    }
                    if (plugin.onTextLayerRender) {
                        plugin.onTextLayerRender(didRenderProps);
                    }
                };
                plugins.forEach((plugin) => handleDidRenderTextLayer(plugin));
                onRenderTextCompleted();
            }, () => {
                containerEle.removeAttribute('data-testid');
                onRenderTextCompleted();
            });
        });
        return () => {
            empty();
            const task = renderTaskRef.current;
            if (task && typeof task.cancel === 'function') {
                task.cancel();
            }
        };
    }, []);
    let transform = '';
    switch (Math.abs(rotation)) {
        case 90:
            transform = 'rotate(90deg) translateY(-100%)';
            break;
        case 180:
            transform = 'rotate(180deg) translate(-100%, -100%)';
            break;
        case 270:
            transform = 'rotate(270deg) translateX(-100%)';
            break;
        default:
            transform = '';
            break;
    }
    return (React.createElement("div", { className: styles.layer, ref: containerRef, style: {
            transform,
        } }));
};
