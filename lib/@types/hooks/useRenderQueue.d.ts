import { type PdfJs } from '../types/PdfJs';
export interface UseRenderQueue {
    getHighestPriorityPage: () => number;
    isInRange: (pageIndex: number) => boolean;
    markNotRendered: () => void;
    markRendered: (pageIndex: number) => void;
    markRendering: (pageIndex: number) => void;
    setOutOfRange: (pageIndex: number) => void;
    setRange: (startIndex: number, endIndex: number) => void;
    setVisibility: (pageIndex: number, visibility: number) => void;
}
export declare const useRenderQueue: ({ doc }: {
    doc: PdfJs.PdfDocument;
}) => UseRenderQueue;
