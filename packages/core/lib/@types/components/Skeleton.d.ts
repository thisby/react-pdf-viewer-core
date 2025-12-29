import * as React from 'react';
interface SkeletonProps {
    children: ({ attributes, ref, }: {
        attributes: React.HTMLAttributes<HTMLElement>;
        ref: React.RefCallback<HTMLElement>;
    }) => React.ReactElement;
}
export declare const Skeleton: ({ children }: SkeletonProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export {};
