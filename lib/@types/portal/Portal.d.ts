import * as React from 'react';
import { Position } from '../structs/Position';
export declare const Portal: React.FC<{
    children: ({ position, ref }: {
        position: Position;
        ref: React.RefCallback<HTMLElement>;
    }) => React.ReactNode;
    offset?: number;
    position: Position;
    referenceRef: React.RefObject<HTMLElement>;
}>;
