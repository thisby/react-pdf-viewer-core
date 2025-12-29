import { ScrollMode } from '../structs/ScrollMode';
import { type Rect } from '../types/Rect';
import { type ItemMeasurement } from './ItemMeasurement';
export declare const measure: (numberOfItems: number, parentRect: Rect, sizes: Rect[], scrollMode: ScrollMode) => ItemMeasurement[];
