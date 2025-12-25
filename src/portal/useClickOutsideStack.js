'use client';
import * as React from 'react';
import { StackContext } from './StackContext';
export const useClickOutsideStack = (closeOnClickOutside, onClickOutside) => {
    const stackContext = React.useContext(StackContext);
    const [ele, setEle] = React.useState();
    const ref = React.useCallback((ele) => {
        setEle(ele);
    }, []);
    const handleClickDocument = React.useCallback((e) => {
        if (!ele || stackContext.currentIndex !== stackContext.numStacks) {
            return;
        }
        const clickedTarget = e.target;
        if (clickedTarget instanceof Element && clickedTarget.shadowRoot) {
            const paths = e.composedPath();
            if (paths.length > 0 && !ele.contains(paths[0])) {
                onClickOutside();
            }
        }
        else if (!ele.contains(clickedTarget)) {
            onClickOutside();
        }
    }, [ele, stackContext.currentIndex, stackContext.numStacks]);
    React.useEffect(() => {
        if (!closeOnClickOutside || !ele) {
            return;
        }
        const eventOptions = {
            capture: true,
        };
        document.addEventListener('click', handleClickDocument, eventOptions);
        return () => {
            document.removeEventListener('click', handleClickDocument, eventOptions);
        };
    }, [ele, stackContext.currentIndex, stackContext.numStacks]);
    return [ref];
};
