'use client';
import * as React from 'react';
import styles from '../styles/progressBar.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const ProgressBar = ({ progress }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    return (React.createElement("div", { className: classNames({
            [styles.bar]: true,
            [styles.barRtl]: isRtl,
        }) },
        React.createElement("div", { className: styles.progress, style: { width: `${progress}%` } },
            progress,
            "%")));
};
