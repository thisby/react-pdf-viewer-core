export const getTitle = (annotation) => {
    return annotation.titleObj ? annotation.titleObj.str : annotation.title || '';
};
