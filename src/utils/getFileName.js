export const getFileName = (url) => {
    const str = url.split('/').pop();
    return str ? str.split('#')[0].split('?')[0] : url;
};
