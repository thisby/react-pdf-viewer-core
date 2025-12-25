import { LoadingStatus } from './LoadingStatus';
export class AskForPasswordState extends LoadingStatus {
    constructor(verifyPassword, passwordStatus) {
        super();
        this.verifyPassword = verifyPassword;
        this.passwordStatus = passwordStatus;
    }
}
