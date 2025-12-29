import { type PdfJs } from './PdfJs';
export interface PdfJsApiProvider {
    getDocument(params: PdfJs.GetDocumentParams): PdfJs.LoadingTask;
    PDFWorker: PdfJs.PDFWorkerConstructor;
    GlobalWorkerOptions: PdfJs.GlobalWorker;
    PasswordResponses: PdfJs.PasswordResponsesValue;
    SVGGraphics: PdfJs.SVGGraphicsConstructor;
    TextLayer: PdfJs.TextLayer;
}
