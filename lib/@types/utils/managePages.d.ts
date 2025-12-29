import { type Destination } from '../types/Destination';
import { type PdfJs } from '../types/PdfJs';
export declare const clearPagesCache: () => void;
export declare const getPage: (doc: PdfJs.PdfDocument, pageIndex: number) => Promise<PdfJs.Page>;
export declare const getDestination: (doc: PdfJs.PdfDocument, dest: PdfJs.OutlineDestinationType) => Promise<Destination>;
