import * as React from 'react';
import { type LocalizationMap } from '../types/LocalizationMap';
export interface LocalizationContextProps {
    l10n: LocalizationMap;
    setL10n(l10n: LocalizationMap): void;
}
export declare const DefaultLocalization: LocalizationMap;
export declare const LocalizationContext: React.Context<LocalizationContextProps>;
