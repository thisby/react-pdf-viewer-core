import { ScrollMode } from '../structs/ScrollMode';
export const buildContainerStyles = (totalSize, scrollMode) => {
    switch (scrollMode) {
        case ScrollMode.Horizontal:
            return {
                position: 'relative',
                height: '100%',
                width: `${totalSize.width}px`,
            };
        case ScrollMode.Vertical:
        default:
            return {
                position: 'relative',
                height: `${totalSize.height}px`,
                width: '100%',
            };
    }
};
