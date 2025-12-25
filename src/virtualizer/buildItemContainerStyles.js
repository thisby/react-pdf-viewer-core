import { ScrollMode } from '../structs/ScrollMode';
export const buildItemContainerStyles = (item, parentRect, scrollMode) => scrollMode !== ScrollMode.Page
    ? {}
    : {
        height: `${parentRect.height}px`,
        width: '100%',
        position: 'absolute',
        top: 0,
        transform: `translateY(${item.start.top}px)`,
    };
