'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StackContext } from './StackContext';
export const Stack = ({ children }) => {
    const { currentIndex, increaseNumStacks, decreaseNumStacks, numStacks } = React.useContext(StackContext);
    React.useEffect(() => {
        increaseNumStacks();
        return () => {
            decreaseNumStacks();
        };
    }, []);
    return ReactDOM.createPortal(React.createElement(StackContext.Provider, { value: {
            currentIndex: currentIndex + 1,
            decreaseNumStacks,
            increaseNumStacks,
            numStacks,
        } }, children), document.body);
};
