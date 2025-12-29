import { type Destination } from '../types/Destination';
export declare const useDestination: ({ getCurrentPage }: {
    getCurrentPage: () => number;
}) => {
    getNextDestination: () => Destination | null;
    getPreviousDestination: () => Destination | null;
    markVisitedDestination: (destination: Destination) => void;
};
