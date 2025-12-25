'use client';
import * as React from 'react';
import { StackContext } from './StackContext';
export const useEscapeStack = (handler) => {
    const stackContext = React.useContext(StackContext);
    const keyUpHandler = React.useCallback((e) => {
        if (e.key === 'Escape' && stackContext.currentIndex === stackContext.numStacks) {
            handler();
        }
    }, [stackContext.currentIndex, stackContext.numStacks]);
    React.useEffect(() => {
        document.addEventListener('keyup', keyUpHandler);
        return () => {
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, [stackContext.currentIndex, stackContext.numStacks]);
};
