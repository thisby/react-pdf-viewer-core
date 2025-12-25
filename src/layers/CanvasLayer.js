'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { LayerRenderStatus } from '../structs/LayerRenderStatus';
import styles from '../styles/canvasLayer.module.css';
import { floatToRatio } from '../utils/floatToRatio';
import { roundToDivide } from '../utils/roundToDivide';
const MAX_CANVAS_SIZE = 4096 * 4096;
export const CanvasLayer = ({ canvasLayerRef, height, page, pageIndex, plugins, rotation, scale, width, onRenderCanvasCompleted }) => {
    const renderTask = React.useRef();
    useIsomorphicLayoutEffect(() => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }
        const canvasEle = canvasLayerRef.current;
        if (!canvasEle) {
            return;
        }
        canvasEle.removeAttribute('data-testid');
        const preRenderProps = {
            ele: canvasEle,
            pageIndex,
            rotation,
            scale,
            status: LayerRenderStatus.PreRender,
        };
        const handlePreRenderCanvasLayer = (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => handlePreRenderCanvasLayer(dep));
            }
            if (plugin.onCanvasLayerRender) {
                plugin.onCanvasLayerRender(preRenderProps);
            }
        };
        plugins.forEach((plugin) => handlePreRenderCanvasLayer(plugin));
        const viewport = page.getViewport({
            rotation,
            scale,
        });
        const outputScale = window.devicePixelRatio || 1;
        const maxScale = Math.sqrt(MAX_CANVAS_SIZE / (viewport.width * viewport.height));
        const shouldScaleByCSS = outputScale > maxScale;
        shouldScaleByCSS ? (canvasEle.style.transform = `scale(1, 1)`) : canvasEle.style.removeProperty('transform');
        const possibleScale = Math.min(maxScale, outputScale);
        const [x, y] = floatToRatio(possibleScale, 8);
        canvasEle.width = roundToDivide(viewport.width * possibleScale, x);
        canvasEle.height = roundToDivide(viewport.height * possibleScale, x);
        canvasEle.style.width = `${roundToDivide(viewport.width, y)}px`;
        canvasEle.style.height = `${roundToDivide(viewport.height, y)}px`;
        canvasEle.hidden = true;
        const canvasContext = canvasEle.getContext('2d', { alpha: false });
        if (!canvasContext) {
            return;
        }
        const transform = shouldScaleByCSS || outputScale !== 1 ? [possibleScale, 0, 0, possibleScale, 0, 0] : undefined;
        renderTask.current = page.render({ canvasContext, transform, viewport });
        renderTask.current.promise.then(() => {
            canvasEle.hidden = false;
            canvasEle.setAttribute('data-testid', `core__canvas-layer-${pageIndex}`);
            const didRenderProps = {
                ele: canvasEle,
                pageIndex,
                rotation,
                scale,
                status: LayerRenderStatus.DidRender,
            };
            const handleDidRenderCanvasLayer = (plugin) => {
                if (plugin.dependencies) {
                    plugin.dependencies.forEach((dep) => handleDidRenderCanvasLayer(dep));
                }
                if (plugin.onCanvasLayerRender) {
                    plugin.onCanvasLayerRender(didRenderProps);
                }
            };
            plugins.forEach((plugin) => handleDidRenderCanvasLayer(plugin));
            onRenderCanvasCompleted();
        }, () => {
            onRenderCanvasCompleted();
        });
        return () => {
            if (canvasEle) {
                canvasEle.width = 0;
                canvasEle.height = 0;
            }
        };
    }, []);
    return (React.createElement("div", { className: styles.layer, style: {
            height: `${height}px`,
            width: `${width}px`,
        } },
        React.createElement("canvas", { ref: canvasLayerRef })));
};
