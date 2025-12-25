'use client';
import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import styles from '../styles/menu.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const Menu = ({ children }) => {
    const containerRef = React.useRef(null);
    const visibleMenuItemsRef = React.useRef([]);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const handleKeyDown = (e) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveToItem((_, currentIndex) => currentIndex + 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                moveToItem((_, currentIndex) => currentIndex - 1);
                break;
            case 'End':
                e.preventDefault();
                moveToItem((items, _) => items.length - 1);
                break;
            case 'Home':
                e.preventDefault();
                moveToItem((_, __) => 0);
                break;
            default:
                break;
        }
    };
    const moveToItem = (getNextItem) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const items = visibleMenuItemsRef.current;
        const currentIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');
        const targetIndex = Math.min(items.length - 1, Math.max(0, getNextItem(items, currentIndex)));
        if (currentIndex >= 0 && currentIndex <= items.length - 1) {
            items[currentIndex].setAttribute('tabindex', '-1');
        }
        items[targetIndex].setAttribute('tabindex', '0');
        items[targetIndex].focus();
    };
    const findVisibleItems = (container) => {
        const visibleItems = [];
        container.querySelectorAll('.rpv-core__menu-item[role="menuitem"]').forEach((item) => {
            if (item instanceof HTMLElement) {
                const parent = item.parentElement;
                if (parent === container) {
                    visibleItems.push(item);
                }
                else {
                    if (window.getComputedStyle(parent).display !== 'none') {
                        visibleItems.push(item);
                    }
                }
            }
        });
        return visibleItems;
    };
    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const visibleItems = findVisibleItems(container);
        visibleMenuItemsRef.current = visibleItems;
    }, []);
    useIsomorphicLayoutEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return (React.createElement("div", { ref: containerRef, "aria-orientation": "vertical", className: classNames({
            [styles.menu]: true,
            [styles.menuRtl]: isRtl,
        }), role: "menu", tabIndex: 0 }, children));
};
