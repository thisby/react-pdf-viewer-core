'use client';
import * as React from 'react';
import { useIsMounted } from './useIsMounted';
export const useRafState = (initialState) => {
    const isMounted = useIsMounted();
    const rafRef = React.useRef(0);
    const [state, setState] = React.useState(initialState);
    const setRafState = React.useCallback((value) => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            isMounted.current && setState(value);
        });
    }, []);
    React.useEffect(() => {
        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, []);
    return [state, setRafState];
};
