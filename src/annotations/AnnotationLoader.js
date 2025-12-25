'use client';
import * as React from 'react';
import { useSafeState } from '../hooks/useSafeState';
export const AnnotationLoader = ({ page, renderAnnotations }) => {
    const [status, setStatus] = useSafeState({
        loading: true,
        annotations: [],
    });
    React.useEffect(() => {
        page.getAnnotations({ intent: 'display' }).then((result) => {
            setStatus({
                loading: false,
                annotations: result,
            });
        });
    }, []);
    return status.loading ? React.createElement(React.Fragment, null) : renderAnnotations(status.annotations);
};
