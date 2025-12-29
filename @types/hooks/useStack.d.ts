export declare const useStack: <T>(maxLength: number) => {
    push: (item: T) => void;
    map: <V>(transformer: (item: T) => V) => V[];
    pop: () => T | null;
};
