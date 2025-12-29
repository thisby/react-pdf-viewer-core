import { ScrollDirection } from '../structs/ScrollDirection';
import { type Offset } from '../types/Offset';
export declare const smoothScroll: (ele: HTMLElement, scrollDirection: ScrollDirection, targetPosition: Offset, duration: number, easing?: (t: number) => number, onReachTarget?: () => void) => void;
