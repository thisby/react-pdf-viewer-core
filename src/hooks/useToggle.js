'use client';
import * as React from 'react';
import { ToggleStatus } from '../structs/ToggleStatus';
export const useToggle = (isOpened) => {
    const [opened, setOpened] = React.useState(isOpened);
    const toggle = (status) => {
        switch (status) {
            case ToggleStatus.Close:
                setOpened(false);
                break;
            case ToggleStatus.Open:
                setOpened(true);
                break;
            case ToggleStatus.Toggle:
            default:
                setOpened((isOpened) => !isOpened);
                break;
        }
    };
    return { opened, toggle };
};
