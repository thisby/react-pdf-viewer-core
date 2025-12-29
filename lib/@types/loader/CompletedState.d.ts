import { type PdfJs } from '../types/PdfJs';
import { LoadingStatus } from './LoadingStatus';
export declare class CompletedState extends LoadingStatus {
    doc: PdfJs.PdfDocument;
    constructor(doc: PdfJs.PdfDocument);
}
