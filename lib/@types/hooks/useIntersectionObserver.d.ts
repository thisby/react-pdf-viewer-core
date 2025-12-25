import * as React from 'react';
import { type VisibilityChanged } from '../types/VisibilityChanged';
interface UseIntersectionObserverProps {
    once?: boolean;
    threshold?: number | number[];
    onVisibilityChanged(params: VisibilityChanged): void;
}
export declare const useIntersectionObserver: (props: UseIntersectionObserverProps) => React.MutableRefObject<HTMLDivElement | null>;
export {};
