export declare const useQueue: <T>(maxLength: number) => {
    dequeue: () => T | null;
    enqueue: (item: T) => void;
    map: <V>(transformer: (item: T) => V) => V[];
};
