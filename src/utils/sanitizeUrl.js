const INVALID_PROTOCOL = /^([^\w]*)(javascript|data|vbscript)/im;
const HTML_ENTITIES = /&#(\w+)(^\w|;)?/g;
const CTRL_CHARS = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
const URL_SCHEME = /^([^:]+):/gm;
const decodeHtmlEntities = (str) => str.replace(HTML_ENTITIES, (_, dec) => String.fromCharCode(dec));
export const sanitizeUrl = (url, defaultUrl = 'about:blank') => {
    const result = decodeHtmlEntities(url || '')
        .replace(CTRL_CHARS, '')
        .trim();
    if (!result) {
        return defaultUrl;
    }
    const firstChar = result[0];
    if (firstChar === '.' || firstChar === '/') {
        return result;
    }
    const parsedUrlScheme = result.match(URL_SCHEME);
    if (!parsedUrlScheme) {
        return result;
    }
    const scheme = parsedUrlScheme[0];
    return INVALID_PROTOCOL.test(scheme) ? defaultUrl : result;
};
