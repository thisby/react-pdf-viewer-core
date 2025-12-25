'use client';
import * as React from 'react';
import enUs from './en_US.json';
export const DefaultLocalization = enUs;
export const LocalizationContext = React.createContext({
    l10n: DefaultLocalization,
    setL10n: () => { },
});
