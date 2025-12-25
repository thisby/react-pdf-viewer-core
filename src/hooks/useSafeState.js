'use client';
import * as React from 'react';
import { useIsMounted } from './useIsMounted';
export const useSafeState = (initialState) => {
    const [state, setState] = React.useState(initialState);
    const useIsMountedRef = useIsMounted();
    const setSafeState = React.useCallback((newState) => {
        if (useIsMountedRef.current) {
            setState(newState);
        }
    }, [useIsMountedRef.current]);
    return [state, setSafeState];
};
