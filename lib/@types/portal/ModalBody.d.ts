import * as React from 'react';
import type { Toggle } from '../types/Toggle';
type RenderChildrenProps = ({ onClose }: {
    onClose: Toggle;
}) => React.ReactNode;
export declare const ModalBody: React.FC<{
    ariaControlsSuffix: string;
    children: RenderChildrenProps;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    onClose: Toggle;
}>;
export {};
