import * as React from 'react';
export declare const useSafeState: <T>(initialState: T | (() => T)) => [T, React.Dispatch<React.SetStateAction<T>>];
