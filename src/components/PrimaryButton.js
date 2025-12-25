'use client';
import * as React from 'react';
import styles from '../styles/primaryButton.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const PrimaryButton = ({ children, testId, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const attrs = testId ? { 'data-testid': testId } : {};
    return (React.createElement("button", Object.assign({ className: classNames({
            [styles.button]: true,
            [styles.buttonRtl]: isRtl,
        }), type: "button", onClick: onClick }, attrs), children));
};
