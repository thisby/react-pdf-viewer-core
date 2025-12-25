export const getFileExt = (url) => {
    const str = url.split(/\./).pop();
    return str ? str.toLowerCase() : '';
};
