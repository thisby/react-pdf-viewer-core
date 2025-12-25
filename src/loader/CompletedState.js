import { LoadingStatus } from './LoadingStatus';
export class CompletedState extends LoadingStatus {
    constructor(doc) {
        super();
        this.doc = doc;
    }
}
