import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';
import { type Slot } from '../types/Slot';
interface RenderChildrenProps {
    popup: {
        opened: boolean;
        closeOnHover: () => void;
        openOnHover: () => void;
        toggleOnClick: () => void;
    };
    slot: Slot;
}
export declare const Annotation: React.FC<{
    annotation: PdfJs.Annotation;
    hasPopup: boolean;
    ignoreBorder: boolean;
    isRenderable: boolean;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    children(props: RenderChildrenProps): React.ReactElement;
}>;
export {};
