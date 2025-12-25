import { LoadingStatus } from './LoadingStatus';
export class FailureState extends LoadingStatus {
    constructor(error) {
        super();
        this.error = error;
    }
}
