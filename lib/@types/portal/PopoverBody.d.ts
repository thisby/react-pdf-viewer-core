import * as React from 'react';
import { Position } from '../structs/Position';
export declare const PopoverBody: React.ForwardRefExoticComponent<{
    ariaControlsSuffix: string;
    children?: React.ReactNode;
    closeOnClickOutside: boolean;
    position: Position;
    onClose(): void;
} & React.RefAttributes<HTMLDivElement>>;
