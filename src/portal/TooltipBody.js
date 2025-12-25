'use client';
import * as React from 'react';
import styles from '../styles/tooltipBody.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import { Arrow } from './Arrow';
import { useEscapeStack } from './useEscapeStack';
export const TooltipBody = React.forwardRef((props, ref) => {
    const { ariaControlsSuffix, children, closeOnEscape, position, onClose } = props;
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    useEscapeStack(() => {
        if (closeOnEscape) {
            onClose();
        }
    });
    return (React.createElement("div", { className: classNames({
            [styles.body]: true,
            [styles.bodyRtl]: isRtl,
        }), id: `rpv-core__tooltip-body-${ariaControlsSuffix}`, ref: ref, role: "tooltip" },
        React.createElement(Arrow, { customClassName: styles.arrow, position: position }),
        React.createElement("div", { className: styles.content }, children)));
});
TooltipBody.displayName = 'TooltipBody';
