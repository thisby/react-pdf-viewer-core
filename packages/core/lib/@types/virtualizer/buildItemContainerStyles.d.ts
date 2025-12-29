import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import { type Rect } from '../types/Rect';
import { type VirtualItem } from './VirtualItem';
export declare const buildItemContainerStyles: (item: VirtualItem, parentRect: Rect, scrollMode: ScrollMode) => React.CSSProperties;
