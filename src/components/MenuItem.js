'use client';
import * as React from 'react';
import { CheckIcon } from '../icons/CheckIcon';
import styles from '../styles/menuItem.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const MenuItem = ({ checked = false, children, icon = null, isDisabled = false, testId, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const attrs = testId ? { 'data-testid': testId } : {};
    return (React.createElement("button", Object.assign({ className: classNames({
            [styles.item]: true,
            [styles.itemDisabled]: isDisabled,
            [styles.itemLtr]: !isRtl,
            [styles.itemRtl]: isRtl,
        }), role: "menuitem", tabIndex: -1, type: "button", onClick: onClick }, attrs),
        React.createElement("div", { className: classNames({
                [styles.icon]: true,
                [styles.iconLtr]: !isRtl,
                [styles.iconRtl]: isRtl,
            }) }, icon),
        React.createElement("div", { className: classNames({
                [styles.label]: true,
                [styles.labelLtr]: !isRtl,
                [styles.labelRtl]: isRtl,
            }) }, children),
        React.createElement("div", { className: classNames({
                [styles.checkLtr]: !isRtl,
                [styles.checkRtl]: isRtl,
            }) }, checked && React.createElement(CheckIcon, null))));
};
