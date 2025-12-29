import * as React from 'react';
import { Position } from '../structs/Position';
type RenderTooltipContent = () => React.ReactNode;
export declare const Tooltip: React.FC<{
    ariaControlsSuffix?: string;
    content: RenderTooltipContent;
    position: Position;
    target: React.ReactElement;
}>;
export {};
