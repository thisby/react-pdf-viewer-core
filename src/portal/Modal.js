'use client';
import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { uniqueId } from '../utils/uniqueId';
import { ModalBody } from './ModalBody';
import { Stack } from './Stack';
export const Modal = ({ ariaControlsSuffix, closeOnClickOutside, closeOnEscape, content, isOpened = false, target }) => {
    const controlsSuffix = ariaControlsSuffix || `${uniqueId()}`;
    const { opened, toggle } = useToggle(isOpened);
    const renderTarget = (toggle, opened) => {
        return target ? (React.createElement("div", { "aria-expanded": opened ? 'true' : 'false', "aria-haspopup": "dialog", "aria-controls": `rpv-core__modal-body-${controlsSuffix}` }, target(toggle, opened))) : (React.createElement(React.Fragment, null));
    };
    const renderContent = (toggle) => (React.createElement(ModalBody, { ariaControlsSuffix: controlsSuffix, closeOnClickOutside: closeOnClickOutside, closeOnEscape: closeOnEscape, onClose: toggle }, ({ onClose }) => content(onClose)));
    return (React.createElement(React.Fragment, null,
        renderTarget(toggle, opened),
        opened && React.createElement(Stack, null, renderContent(toggle))));
};
