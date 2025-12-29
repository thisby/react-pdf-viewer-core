import { LoadError } from './LoadError';
import { LoadingStatus } from './LoadingStatus';
export declare class FailureState extends LoadingStatus {
    error: LoadError;
    constructor(error: LoadError);
}
