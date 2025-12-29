import * as React from 'react';
import { type CharacterMap } from '../types/CharacterMap';
import { type DocumentAskPasswordEvent } from '../types/DocumentAskPasswordEvent';
import { type PdfJs } from '../types/PdfJs';
import { type RenderProtectedView } from '../types/RenderProtectedView';
import { type LoadError } from './LoadError';
export type RenderError = (error: LoadError) => React.ReactElement;
export declare const DocumentLoader: React.FC<{
    characterMap?: CharacterMap;
    file: PdfJs.FileData;
    httpHeaders?: Record<string, string | string[]>;
    render(doc: PdfJs.PdfDocument): React.ReactElement;
    renderError?: RenderError;
    renderLoader?(percentages: number): React.ReactElement;
    renderProtectedView?: RenderProtectedView;
    transformGetDocumentParams?(options: PdfJs.GetDocumentParams): PdfJs.GetDocumentParams;
    withCredentials: boolean;
    onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
}>;
