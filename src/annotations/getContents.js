export const getContents = (annotation) => {
    return annotation.contentsObj ? annotation.contentsObj.str : annotation.contents || '';
};
