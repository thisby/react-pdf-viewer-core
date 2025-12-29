import * as React from 'react';
import { ScrollDirection } from '../structs/ScrollDirection';
import { type Offset } from '../types/Offset';
export declare const useScroll: ({ elementRef, enableSmoothScroll, isRtl, scrollDirection, onSmoothScroll, }: {
    elementRef: React.RefObject<HTMLDivElement>;
    enableSmoothScroll: boolean;
    isRtl: boolean;
    scrollDirection: ScrollDirection;
    onSmoothScroll: (isScrollingSmoothly: boolean) => void;
}) => {
    scrollOffset: Offset;
    scrollTo: (offset: Offset, withSmoothScroll: boolean) => Promise<void>;
};
