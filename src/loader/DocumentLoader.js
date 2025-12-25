'use client';
import * as React from 'react';
import { Spinner } from '../components/Spinner';
import { useSafeState } from '../hooks/useSafeState';
import { PasswordStatus } from '../structs/PasswordStatus';
import styles from '../styles/documentLoader.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import { PdfJsApiContext } from '../vendors/PdfJsApiContext';
import { AskForPasswordState } from './AskForPasswordState';
import { AskingPassword } from './AskingPassword';
import { CompletedState } from './CompletedState';
import { FailureState } from './FailureState';
import { LoadingState } from './LoadingState';
export const DocumentLoader = ({ characterMap, file, httpHeaders, render, renderError, renderLoader, renderProtectedView, transformGetDocumentParams, withCredentials, onDocumentAskPassword, }) => {
    const { pdfJsApiProvider } = React.useContext(PdfJsApiContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const [status, setStatus] = useSafeState(new LoadingState(0));
    const docRef = React.useRef('');
    React.useEffect(() => {
        if (!pdfJsApiProvider) {
            return;
        }
        docRef.current = '';
        setStatus(new LoadingState(0));
        const worker = new pdfJsApiProvider.PDFWorker({ name: `PDFWorker_${Date.now()}` });
        const params = Object.assign({
            httpHeaders,
            withCredentials,
            worker,
        }, 'string' === typeof file ? { url: file } : { data: file }, characterMap
            ? {
                cMapUrl: characterMap.url,
                cMapPacked: characterMap.isCompressed,
            }
            : {});
        const transformParams = transformGetDocumentParams ? transformGetDocumentParams(params) : params;
        const loadingTask = pdfJsApiProvider.getDocument(transformParams);
        loadingTask.onPassword = (verifyPassword, reason) => {
            switch (reason) {
                case pdfJsApiProvider.PasswordResponses.NEED_PASSWORD:
                    setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.RequiredPassword));
                    break;
                case pdfJsApiProvider.PasswordResponses.INCORRECT_PASSWORD:
                    setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.WrongPassword));
                    break;
                default:
                    break;
            }
        };
        loadingTask.onProgress = (progress) => {
            const loaded = progress.total > 0
                ?
                    Math.min(100, (100 * progress.loaded) / progress.total)
                : 100;
            if (docRef.current === '') {
                setStatus(new LoadingState(loaded));
            }
        };
        loadingTask.promise.then((doc) => {
            docRef.current = doc.loadingTask.docId;
            setStatus(new CompletedState(doc));
        }, (err) => !worker.destroyed &&
            setStatus(new FailureState({
                message: err.message || 'Cannot load document',
                name: err.name,
            })));
        return () => {
            loadingTask.destroy();
            worker.destroy();
        };
    }, [file]);
    if (status instanceof AskForPasswordState) {
        return (React.createElement(AskingPassword, { passwordStatus: status.passwordStatus, renderProtectedView: renderProtectedView, verifyPassword: status.verifyPassword, onDocumentAskPassword: onDocumentAskPassword }));
    }
    if (status instanceof CompletedState) {
        return render(status.doc);
    }
    if (status instanceof FailureState) {
        return renderError ? (renderError(status.error)) : (React.createElement("div", { className: classNames({
                [styles.error]: true,
                [styles.errorRtl]: isRtl,
            }) },
            React.createElement("div", { className: styles.errorText }, status.error.message)));
    }
    return (React.createElement("div", { "data-testid": "core__doc-loading", className: classNames({
            [styles.loading]: true,
            [styles.loadingRtl]: isRtl,
        }) }, renderLoader ? renderLoader(status.percentages) : React.createElement(Spinner, null)));
};
