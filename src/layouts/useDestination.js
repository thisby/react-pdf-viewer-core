'use client';
import * as React from 'react';
import { useQueue } from '../hooks/useQueue';
import { useStack } from '../hooks/useStack';
const MAX_QUEUE_LENGTH = 50;
export const useDestination = ({ getCurrentPage }) => {
    const previousDestinations = useStack(MAX_QUEUE_LENGTH);
    const nextDestinations = useQueue(MAX_QUEUE_LENGTH);
    const getNextDestination = () => {
        const nextDest = nextDestinations.dequeue();
        if (nextDest) {
            previousDestinations.push(nextDest);
        }
        if (nextDest && nextDest.pageIndex === getCurrentPage()) {
            return getNextDestination();
        }
        return nextDest;
    };
    const getPreviousDestination = () => {
        const prevDest = previousDestinations.pop();
        if (prevDest) {
            nextDestinations.enqueue(prevDest);
        }
        if (prevDest && prevDest.pageIndex === getCurrentPage()) {
            return getPreviousDestination();
        }
        return prevDest;
    };
    const markVisitedDestination = React.useCallback((destination) => {
        previousDestinations.push(destination);
    }, []);
    return {
        getNextDestination,
        getPreviousDestination,
        markVisitedDestination,
    };
};
