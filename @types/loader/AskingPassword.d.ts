import * as React from 'react';
import { PasswordStatus } from '../structs/PasswordStatus';
import { type DocumentAskPasswordEvent } from '../types/DocumentAskPasswordEvent';
import { type RenderProtectedView } from '../types/RenderProtectedView';
export declare const AskingPassword: React.FC<{
    passwordStatus: PasswordStatus;
    renderProtectedView?: RenderProtectedView;
    verifyPassword: (password: string) => void;
    onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
}>;
