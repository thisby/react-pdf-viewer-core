'use client';
import * as React from 'react';
import styles from '../styles/minimalButton.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const MinimalButton = ({ ariaLabel = '', ariaKeyShortcuts = '', children, isDisabled = false, isSelected = false, testId, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const attrs = testId ? { 'data-testid': testId } : {};
    return (React.createElement("button", Object.assign({ "aria-label": ariaLabel }, (ariaKeyShortcuts && { 'aria-keyshortcuts': ariaKeyShortcuts }), (isDisabled && { 'aria-disabled': true }), { className: classNames({
            [styles.button]: true,
            [styles.buttonDisabled]: isDisabled,
            [styles.buttonRtl]: isRtl,
            [styles.buttonSelected]: isSelected,
        }), type: "button", onClick: onClick }, attrs), children));
};
