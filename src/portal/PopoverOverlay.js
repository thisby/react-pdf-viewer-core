'use client';
import * as React from 'react';
import styles from '../styles/popoverOverlay.module.css';
import { useEscapeStack } from './useEscapeStack';
export const PopoverOverlay = ({ children, closeOnEscape, onClose }) => {
    const containerRef = React.useRef(null);
    useEscapeStack(() => {
        if (closeOnEscape) {
            onClose();
        }
    });
    return (React.createElement("div", { className: styles.overlay, ref: containerRef }, children));
};
