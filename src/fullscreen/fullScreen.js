'use client';
var Api;
(function (Api) {
    Api[Api["ExitFullScreen"] = 0] = "ExitFullScreen";
    Api[Api["FullScreenChange"] = 1] = "FullScreenChange";
    Api[Api["FullScreenElement"] = 2] = "FullScreenElement";
    Api[Api["FullScreenEnabled"] = 3] = "FullScreenEnabled";
    Api[Api["RequestFullScreen"] = 4] = "RequestFullScreen";
})(Api || (Api = {}));
const defaultVendor = {
    ExitFullScreen: 'exitFullscreen',
    FullScreenChange: 'fullscreenchange',
    FullScreenElement: 'fullscreenElement',
    FullScreenEnabled: 'fullscreenEnabled',
    RequestFullScreen: 'requestFullscreen',
};
const webkitVendor = {
    ExitFullScreen: 'webkitExitFullscreen',
    FullScreenChange: 'webkitfullscreenchange',
    FullScreenElement: 'webkitFullscreenElement',
    FullScreenEnabled: 'webkitFullscreenEnabled',
    RequestFullScreen: 'webkitRequestFullscreen',
};
const msVendor = {
    ExitFullScreen: 'msExitFullscreen',
    FullScreenChange: 'msFullscreenChange',
    FullScreenElement: 'msFullscreenElement',
    FullScreenEnabled: 'msFullscreenEnabled',
    RequestFullScreen: 'msRequestFullscreen',
};
const isBrowser = typeof window !== 'undefined';
const vendor = isBrowser
    ? (Api.FullScreenEnabled in document && defaultVendor) ||
        (webkitVendor.FullScreenEnabled in document && webkitVendor) ||
        (msVendor.FullScreenEnabled in document && msVendor) ||
        defaultVendor
    : defaultVendor;
const isFullScreenEnabled = () => isBrowser && vendor.FullScreenEnabled in document && document[vendor.FullScreenEnabled] === true;
const addFullScreenChangeListener = (handler) => {
    if (isBrowser) {
        document.addEventListener(vendor.FullScreenChange, handler);
    }
};
const removeFullScreenChangeListener = (handler) => {
    if (isBrowser) {
        document.removeEventListener(vendor.FullScreenChange, handler);
    }
};
const exitFullScreen = (element) => {
    return isBrowser
        ?
            element[vendor.ExitFullScreen]()
        : Promise.resolve({});
};
const getFullScreenElement = () => {
    return isBrowser ? document[vendor.FullScreenElement] : null;
};
const requestFullScreen = (element) => {
    if (isBrowser) {
        element[vendor.RequestFullScreen]();
    }
};
export { addFullScreenChangeListener, exitFullScreen, getFullScreenElement, isFullScreenEnabled, removeFullScreenChangeListener, requestFullScreen, };
