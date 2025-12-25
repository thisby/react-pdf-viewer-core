import * as React from 'react';
import { FullScreenMode } from '../structs/FullScreenMode';
export declare const useFullScreen: ({ targetRef }: {
    targetRef: React.RefObject<HTMLElement>;
}) => {
    enterFullScreenMode: (target: HTMLElement) => void;
    exitFullScreenMode: () => void;
    fullScreenMode: FullScreenMode;
};
