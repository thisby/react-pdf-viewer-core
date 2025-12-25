'use client';
import * as React from 'react';
import { ResizeIcon } from '../icons/ResizeIcon';
import styles from '../styles/splitter.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
export const Splitter = ({ constrain }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const resizerRef = React.useRef(null);
    const leftSideRef = React.useRef(null);
    const rightSideRef = React.useRef(null);
    const xRef = React.useRef(0);
    const yRef = React.useRef(0);
    const leftWidthRef = React.useRef(0);
    const resizerWidthRef = React.useRef(0);
    const eventOptions = {
        capture: true,
    };
    const handleMouseMove = (e) => {
        const resizerEle = resizerRef.current;
        const leftSide = leftSideRef.current;
        const rightSide = rightSideRef.current;
        if (!resizerEle || !leftSide || !rightSide) {
            return;
        }
        const resizerWidth = resizerWidthRef.current;
        const dx = e.clientX - xRef.current;
        const firstHalfSize = leftWidthRef.current + (isRtl ? -dx : dx);
        const containerWidth = resizerEle.parentElement.getBoundingClientRect().width;
        const firstHalfPercentage = (firstHalfSize * 100) / containerWidth;
        resizerEle.classList.add(styles.splitterResizing);
        if (constrain) {
            const secondHalfSize = containerWidth - firstHalfSize - resizerWidth;
            const secondHalfPercentage = (secondHalfSize * 100) / containerWidth;
            if (!constrain({ firstHalfPercentage, firstHalfSize, secondHalfPercentage, secondHalfSize })) {
                return;
            }
        }
        leftSide.style.width = `${firstHalfPercentage}%`;
        document.body.classList.add(styles.bodyResizing);
        leftSide.classList.add(styles.siblingResizing);
        rightSide.classList.add(styles.siblingResizing);
    };
    const handleMouseUp = (e) => {
        const resizerEle = resizerRef.current;
        const leftSide = leftSideRef.current;
        const rightSide = rightSideRef.current;
        if (!resizerEle || !leftSide || !rightSide) {
            return;
        }
        document.body.classList.remove(styles.bodyResizing);
        resizerEle.classList.remove(styles.splitterResizing);
        leftSide.classList.remove(styles.siblingResizing);
        rightSide.classList.remove(styles.siblingResizing);
        document.removeEventListener('mousemove', handleMouseMove, eventOptions);
        document.removeEventListener('mouseup', handleMouseUp, eventOptions);
    };
    const handleMouseDown = (e) => {
        const leftSide = leftSideRef.current;
        if (!leftSide) {
            return;
        }
        xRef.current = e.clientX;
        yRef.current = e.clientY;
        leftWidthRef.current = leftSide.getBoundingClientRect().width;
        document.addEventListener('mousemove', handleMouseMove, eventOptions);
        document.addEventListener('mouseup', handleMouseUp, eventOptions);
    };
    React.useEffect(() => {
        const resizerEle = resizerRef.current;
        if (!resizerEle) {
            return;
        }
        resizerWidthRef.current = resizerEle.getBoundingClientRect().width;
        leftSideRef.current = resizerEle.previousElementSibling;
        rightSideRef.current = resizerEle.nextElementSibling;
    }, []);
    return (React.createElement("div", { ref: resizerRef, className: styles.splitter, onMouseDown: handleMouseDown },
        React.createElement("div", { className: styles.handle },
            React.createElement(ResizeIcon, null))));
};
