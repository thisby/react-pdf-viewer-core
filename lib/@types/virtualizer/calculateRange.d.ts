import { ScrollDirection } from '../structs/ScrollDirection';
import { type Offset } from '../types/Offset';
import { type Rect } from '../types/Rect';
import { type ItemMeasurement } from './ItemMeasurement';
export declare const calculateRange: (scrollDirection: ScrollDirection, measurements: ItemMeasurement[], outerSize: Rect, scrollOffset: Offset) => {
    start: number;
    end: number;
};
