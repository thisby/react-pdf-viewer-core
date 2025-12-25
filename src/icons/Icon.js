'use client';
import * as React from 'react';
import styles from '../styles/icon.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const Icon = ({ children, ignoreDirection = false, size = 24 }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = !ignoreDirection && direction === TextDirection.RightToLeft;
    const width = `${size || 24}px`;
    return (React.createElement("svg", { "aria-hidden": "true", className: classNames({
            [styles.icon]: true,
            [styles.iconRtl]: isRtl,
        }), focusable: "false", height: width, viewBox: "0 0 24 24", width: width }, children));
};
