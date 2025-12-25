import * as React from 'react';
export declare const useRafState: <T>(initialState: T | (() => T)) => [T, React.Dispatch<React.SetStateAction<T>>];
