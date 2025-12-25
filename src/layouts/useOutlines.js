'use client';
import * as React from 'react';
import { useSafeState } from '../hooks/useSafeState';
const flaternSingleOutline = (outline) => {
    let result = [];
    if (outline.items && outline.items.length > 0) {
        result = result.concat(flaternOutlines(outline.items));
    }
    return result;
};
const flaternOutlines = (outlines) => {
    let result = [];
    outlines.map((outline) => {
        result = result.concat(outline).concat(flaternSingleOutline(outline));
    });
    return result;
};
export const useOutlines = (doc) => {
    const [outlines, setOutlines] = useSafeState([]);
    React.useEffect(() => {
        doc.getOutline().then((result) => {
            if (result !== null) {
                const items = flaternOutlines(result);
                setOutlines(items);
            }
        });
    }, []);
    return outlines;
};
