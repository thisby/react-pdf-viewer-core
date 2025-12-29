import * as React from 'react';
import { Position } from '../structs/Position';
export declare const TooltipBody: React.ForwardRefExoticComponent<{
    ariaControlsSuffix: string;
    children?: React.ReactNode;
    closeOnEscape: boolean;
    position: Position;
    onClose(): void;
} & React.RefAttributes<HTMLDivElement>>;
