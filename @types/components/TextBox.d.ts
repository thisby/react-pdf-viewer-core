import * as React from 'react';
export declare const TextBox: React.FC<{
    ariaLabel?: string;
    autoFocus?: boolean;
    placeholder?: string;
    testId?: string;
    type?: 'text' | 'password';
    value?: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}>;
