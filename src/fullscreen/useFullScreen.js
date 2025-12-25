'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { useWindowResize } from '../hooks/useWindowResize';
import { FullScreenMode } from '../structs/FullScreenMode';
import { addFullScreenChangeListener, exitFullScreen, getFullScreenElement, isFullScreenEnabled, removeFullScreenChangeListener, requestFullScreen, } from './fullScreen';
const ZERO_RECT = {
    height: 0,
    width: 0,
};
const EPSILON = 2;
const equal = (a, b) => Math.abs(a - b) <= EPSILON;
export const useFullScreen = ({ targetRef }) => {
    const [fullScreenMode, setFullScreenMode] = React.useState(FullScreenMode.Normal);
    const windowRect = useWindowResize();
    const [targetRect, setTargetRect] = React.useState(ZERO_RECT);
    const windowSizeBeforeFullScreenRef = React.useRef(ZERO_RECT);
    const fullScreenSizeRef = React.useRef(ZERO_RECT);
    const [element, setElement] = React.useState(targetRef.current);
    const fullScreenElementRef = React.useRef(null);
    useIsomorphicLayoutEffect(() => {
        if (targetRef.current !== element) {
            setElement(targetRef.current);
        }
    }, []);
    useIsomorphicLayoutEffect(() => {
        if (!element) {
            return;
        }
        const io = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                setTargetRect({
                    height: entry.target.clientHeight,
                    width: entry.target.clientWidth,
                });
            });
        });
        io.observe(element);
        return () => {
            io.unobserve(element);
            io.disconnect();
        };
    }, [element]);
    const closeOtherFullScreen = React.useCallback((target) => {
        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle && currentFullScreenEle !== target) {
            setFullScreenMode(FullScreenMode.Normal);
            return exitFullScreen(currentFullScreenEle);
        }
        return Promise.resolve();
    }, []);
    const enterFullScreenMode = React.useCallback((target) => {
        if (!target || !isFullScreenEnabled()) {
            return;
        }
        setElement(target);
        closeOtherFullScreen(target).then(() => {
            fullScreenElementRef.current = target;
            setFullScreenMode(FullScreenMode.Entering);
            requestFullScreen(target);
        });
    }, []);
    const exitFullScreenMode = React.useCallback(() => {
        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle) {
            setFullScreenMode(FullScreenMode.Exitting);
            exitFullScreen(document);
        }
    }, []);
    const handleFullScreenChange = React.useCallback(() => {
        if (!element) {
            return;
        }
        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle !== element) {
            setFullScreenMode(FullScreenMode.Exitting);
        }
    }, [element]);
    React.useEffect(() => {
        switch (fullScreenMode) {
            case FullScreenMode.Entering:
                if (fullScreenElementRef.current) {
                    fullScreenElementRef.current.style.backgroundColor = 'hsl(var(--rpv-background))';
                }
                windowSizeBeforeFullScreenRef.current = {
                    height: window.innerHeight,
                    width: window.innerWidth,
                };
                break;
            case FullScreenMode.Entered:
                break;
            case FullScreenMode.Exitting:
                if (fullScreenElementRef.current) {
                    fullScreenElementRef.current.style.backgroundColor = '';
                    fullScreenElementRef.current = null;
                }
                break;
            case FullScreenMode.Exited:
                setFullScreenMode(FullScreenMode.Normal);
                break;
            default:
                break;
        }
    }, [fullScreenMode]);
    React.useEffect(() => {
        if (fullScreenMode === FullScreenMode.Normal) {
            return;
        }
        if (fullScreenMode === FullScreenMode.Entering &&
            equal(windowRect.height, targetRect.height) &&
            equal(windowRect.width, targetRect.width) &&
            windowRect.height > 0 &&
            windowRect.width > 0 &&
            (fullScreenSizeRef.current.height === 0 || equal(windowRect.height, fullScreenSizeRef.current.height))) {
            fullScreenSizeRef.current = {
                height: window.innerHeight,
                width: window.innerWidth,
            };
            setFullScreenMode(FullScreenMode.Entered);
            return;
        }
        if (fullScreenMode === FullScreenMode.Exitting &&
            equal(windowSizeBeforeFullScreenRef.current.height, windowRect.height) &&
            equal(windowSizeBeforeFullScreenRef.current.width, windowRect.width) &&
            windowRect.height > 0 &&
            windowRect.width > 0) {
            setFullScreenMode(FullScreenMode.Exited);
        }
    }, [fullScreenMode, windowRect, targetRect]);
    React.useEffect(() => {
        addFullScreenChangeListener(handleFullScreenChange);
        return () => {
            removeFullScreenChangeListener(handleFullScreenChange);
        };
    }, [element]);
    return {
        enterFullScreenMode,
        exitFullScreenMode,
        fullScreenMode,
    };
};
