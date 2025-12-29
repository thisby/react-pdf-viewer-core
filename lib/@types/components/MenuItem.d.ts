import * as React from 'react';
export declare const MenuItem: React.FC<{
    checked?: boolean;
    children?: React.ReactNode;
    icon?: React.ReactElement;
    isDisabled?: boolean;
    testId?: string;
    onClick(): void;
}>;
