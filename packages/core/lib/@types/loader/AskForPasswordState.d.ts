import { LoadingStatus } from './LoadingStatus';
import { PasswordStatus } from '../structs/PasswordStatus';
export declare class AskForPasswordState extends LoadingStatus {
    verifyPassword: (password: string) => void;
    passwordStatus: PasswordStatus;
    constructor(verifyPassword: (password: string) => void, passwordStatus: PasswordStatus);
}
