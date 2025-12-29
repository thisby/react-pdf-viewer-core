declare const isFullScreenEnabled: () => boolean;
declare const addFullScreenChangeListener: (handler: () => void) => void;
declare const removeFullScreenChangeListener: (handler: () => void) => void;
declare const exitFullScreen: (element: Element | Document) => Promise<void>;
declare const getFullScreenElement: () => Element | null;
declare const requestFullScreen: (element: Element) => void;
export { addFullScreenChangeListener, exitFullScreen, getFullScreenElement, isFullScreenEnabled, removeFullScreenChangeListener, requestFullScreen, };
