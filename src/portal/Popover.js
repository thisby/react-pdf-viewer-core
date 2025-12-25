'use client';
import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { uniqueId } from '../utils/uniqueId';
import { PopoverBody } from './PopoverBody';
import { PopoverOverlay } from './PopoverOverlay';
import { Portal } from './Portal';
export const Popover = ({ ariaHasPopup = 'dialog', ariaControlsSuffix, closeOnClickOutside, closeOnEscape, content, lockScroll = true, position, target, }) => {
    const { opened, toggle } = useToggle(false);
    const targetRef = React.useRef(null);
    const controlsSuffix = React.useMemo(() => ariaControlsSuffix || `${uniqueId()}`, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: targetRef, "aria-expanded": opened ? 'true' : 'false', "aria-haspopup": ariaHasPopup, "aria-controls": `rpv-core__popver-body-${controlsSuffix}` }, target(toggle, opened)),
        opened && (React.createElement(Portal, { offset: 8, position: position, referenceRef: targetRef }, ({ position: updatedPosition, ref }) => {
            const popoverBody = (React.createElement(PopoverBody, { ariaControlsSuffix: controlsSuffix, closeOnClickOutside: closeOnClickOutside, position: updatedPosition, ref: ref, onClose: toggle }, content(toggle)));
            return lockScroll ? (React.createElement(PopoverOverlay, { closeOnEscape: closeOnEscape, onClose: toggle }, popoverBody)) : (popoverBody);
        }))));
};
