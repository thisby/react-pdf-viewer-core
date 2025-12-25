import { LoadingStatus } from './LoadingStatus';
export class LoadingState extends LoadingStatus {
    constructor(percentages) {
        super();
        this.percentages = percentages;
    }
}
