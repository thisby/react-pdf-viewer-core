import * as React from 'react';
export declare const StackContext: React.Context<{
    currentIndex: number;
    decreaseNumStacks: () => void;
    increaseNumStacks: () => void;
    numStacks: number;
}>;
