'use client';
import * as React from 'react';
export const useStack = (maxLength) => {
    const stackRef = React.useRef([]);
    const map = (transformer) => {
        return stackRef.current.map((item) => transformer(item));
    };
    const pop = () => {
        const stack = stackRef.current;
        const size = stack.length;
        if (size === 0) {
            return null;
        }
        const lastItem = stack.pop();
        stackRef.current = stack;
        return lastItem;
    };
    const push = (item) => {
        const stack = stackRef.current;
        if (stack.length + 1 > maxLength) {
            stack.shift();
        }
        stack.push(item);
        stackRef.current = stack;
    };
    React.useEffect(() => {
        return () => {
            stackRef.current = [];
        };
    }, []);
    return {
        push,
        map,
        pop,
    };
};
