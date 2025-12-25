import { Breakpoint } from '../structs/Breakpoint';
export const determineBreakpoint = (width) => {
    switch (true) {
        case width <= 36 * 16:
            return Breakpoint.ExtraSmall;
        case width <= 48 * 16:
            return Breakpoint.Small;
        case width <= 62 * 16:
            return Breakpoint.Medium;
        case width <= 75 * 16:
            return Breakpoint.Large;
        default:
            return Breakpoint.ExtraLarge;
    }
};
