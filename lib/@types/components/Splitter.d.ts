import * as React from 'react';
export interface SplitterSize {
    firstHalfPercentage: number;
    firstHalfSize: number;
    secondHalfPercentage: number;
    secondHalfSize: number;
}
export declare const Splitter: React.FC<{
    constrain?(size: SplitterSize): boolean;
}>;
