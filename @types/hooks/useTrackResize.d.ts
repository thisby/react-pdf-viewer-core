import * as React from 'react';
interface UseTrackResizeProps {
    targetRef: React.RefObject<HTMLDivElement>;
    onResize(target: Element): void;
}
export declare const useTrackResize: ({ targetRef, onResize }: UseTrackResizeProps) => void;
export {};
