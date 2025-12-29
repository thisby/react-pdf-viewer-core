import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
import { type Rect } from '../types/Rect';
import { type VirtualItem } from './VirtualItem';
export declare const buildItemStyles: (item: VirtualItem, isRtl: boolean, sizes: Rect[], viewMode: ViewMode, scrollMode: ScrollMode) => React.CSSProperties;
