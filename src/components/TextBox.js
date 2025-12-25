'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import styles from '../styles/textBox.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const TextBox = ({ ariaLabel = '', autoFocus = false, placeholder = '', testId, type = 'text', value = '', onChange, onKeyDown = () => { }, }) => {
    const { direction } = React.useContext(ThemeContext);
    const textboxRef = React.useRef(null);
    const isRtl = direction === TextDirection.RightToLeft;
    const attrs = {
        ref: textboxRef,
        'data-testid': '',
        'aria-label': ariaLabel,
        className: classNames({
            [styles.textbox]: true,
            [styles.textboxRtl]: isRtl,
        }),
        placeholder,
        value,
        onChange: (e) => onChange(e.target.value),
        onKeyDown,
    };
    if (testId) {
        attrs['data-testid'] = testId;
    }
    useIsomorphicLayoutEffect(() => {
        if (autoFocus) {
            const textboxEle = textboxRef.current;
            if (textboxEle) {
                const x = window.scrollX;
                const y = window.scrollY;
                textboxEle.focus();
                window.scrollTo(x, y);
            }
        }
    }, []);
    return type === 'text' ? React.createElement("input", Object.assign({ type: "text" }, attrs)) : React.createElement("input", Object.assign({ type: "password" }, attrs));
};
