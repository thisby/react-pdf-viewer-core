'use client';
import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { ToggleStatus } from '../structs/ToggleStatus';
var TogglePopupBy;
(function (TogglePopupBy) {
    TogglePopupBy["Click"] = "Click";
    TogglePopupBy["Hover"] = "Hover";
})(TogglePopupBy || (TogglePopupBy = {}));
export const useTogglePopup = () => {
    const { opened, toggle } = useToggle(false);
    const [togglePopupBy, setTooglePopupBy] = React.useState(TogglePopupBy.Hover);
    const toggleOnClick = () => {
        switch (togglePopupBy) {
            case TogglePopupBy.Click:
                opened && setTooglePopupBy(TogglePopupBy.Hover);
                toggle(ToggleStatus.Toggle);
                break;
            case TogglePopupBy.Hover:
                setTooglePopupBy(TogglePopupBy.Click);
                toggle(ToggleStatus.Open);
                break;
        }
    };
    const openOnHover = () => {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Open);
    };
    const closeOnHover = () => {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Close);
    };
    return {
        opened,
        closeOnHover,
        openOnHover,
        toggleOnClick,
    };
};
