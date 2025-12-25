'use client';
import * as React from 'react';
export const StackContext = React.createContext({
    currentIndex: 0,
    decreaseNumStacks: () => { },
    increaseNumStacks: () => { },
    numStacks: 0,
});
