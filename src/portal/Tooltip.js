'use client';
import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { ToggleStatus } from '../structs/ToggleStatus';
import { uniqueId } from '../utils/uniqueId';
import { Portal } from './Portal';
import { TooltipBody } from './TooltipBody';
export const Tooltip = ({ ariaControlsSuffix, content, position, target }) => {
    const { opened, toggle } = useToggle(false);
    const targetRef = React.useRef(null);
    const contentRef = React.useRef();
    const controlsSuffix = React.useMemo(() => ariaControlsSuffix || `${uniqueId()}`, []);
    const open = () => {
        toggle(ToggleStatus.Open);
    };
    const close = () => {
        toggle(ToggleStatus.Close);
    };
    const onBlur = (e) => {
        const shouldHideTooltip = e.relatedTarget instanceof HTMLElement &&
            e.currentTarget.parentElement &&
            e.currentTarget.parentElement.contains(e.relatedTarget);
        if (shouldHideTooltip) {
            if (contentRef.current) {
                contentRef.current.style.display = 'none';
            }
        }
        else {
            close();
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: targetRef, "aria-describedby": `rpv-core__tooltip-body-${controlsSuffix}`, onBlur: onBlur, onFocus: open, onMouseEnter: open, onMouseLeave: close }, target),
        opened && (React.createElement(Portal, { offset: 8, position: position, referenceRef: targetRef }, ({ position: updatedPosition, ref }) => (React.createElement(TooltipBody, { ariaControlsSuffix: controlsSuffix, closeOnEscape: true, position: updatedPosition, ref: ref, onClose: close }, content()))))));
};
