import { type Store, type StoreState } from '../types/Store';
export declare function createStore<T extends StoreState>(initialState?: T): Store<T>;
