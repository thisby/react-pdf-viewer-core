import * as React from 'react';
import type { Toggle } from '../types/Toggle';
export type RenderContent = (toggle: Toggle) => React.ReactNode;
export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;
export declare const Modal: React.FC<{
    ariaControlsSuffix?: string;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    isOpened?: boolean;
    target?: RenderTarget;
}>;
