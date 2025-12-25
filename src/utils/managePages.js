import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
const normalizeDestination = (pageIndex, destArray) => {
    switch (destArray[1].name) {
        case 'XYZ':
            return {
                bottomOffset: (_, viewportHeight) => destArray[3] === null ? viewportHeight : destArray[3],
                leftOffset: (_, __) => (destArray[2] === null ? 0 : destArray[2]),
                pageIndex,
                scaleTo: destArray[4],
            };
        case 'Fit':
        case 'FitB':
            return {
                bottomOffset: 0,
                leftOffset: 0,
                pageIndex,
                scaleTo: SpecialZoomLevel.PageFit,
            };
        case 'FitH':
        case 'FitBH':
            return {
                bottomOffset: destArray[2],
                leftOffset: 0,
                pageIndex,
                scaleTo: SpecialZoomLevel.PageWidth,
            };
        default:
            return {
                bottomOffset: 0,
                leftOffset: 0,
                pageIndex,
                scaleTo: 1,
            };
    }
};
const pageOutlinesMap = new Map();
const pagesMap = new Map();
const generateRefKey = (doc, outline) => `${doc.loadingTask.docId}___${outline.num}R${outline.gen === 0 ? '' : outline.gen}`;
const getPageIndex = (doc, outline) => {
    const key = generateRefKey(doc, outline);
    return pageOutlinesMap.has(key) ? pageOutlinesMap.get(key) : null;
};
const cacheOutlineRef = (doc, outline, pageIndex) => {
    pageOutlinesMap.set(generateRefKey(doc, outline), pageIndex);
};
export const clearPagesCache = () => {
    pageOutlinesMap.clear();
    pagesMap.clear();
};
export const getPage = (doc, pageIndex) => {
    if (!doc) {
        return Promise.reject('The document is not loaded yet');
    }
    const pageKey = `${doc.loadingTask.docId}___${pageIndex}`;
    const page = pagesMap.get(pageKey);
    if (page) {
        return Promise.resolve(page);
    }
    return new Promise((resolve, _) => {
        doc.getPage(pageIndex + 1).then((page) => {
            pagesMap.set(pageKey, page);
            if (page.ref) {
                cacheOutlineRef(doc, page.ref, pageIndex);
            }
            resolve(page);
        });
    });
};
export const getDestination = (doc, dest) => {
    return new Promise((res) => {
        new Promise((resolve) => {
            if (typeof dest === 'string') {
                doc.getDestination(dest).then((destArray) => {
                    resolve(destArray);
                });
            }
            else {
                resolve(dest);
            }
        }).then((destArray) => {
            if ('object' === typeof destArray[0] && destArray[0] !== null) {
                const outlineRef = destArray[0];
                const pageIndex = getPageIndex(doc, outlineRef);
                if (pageIndex === null) {
                    doc.getPageIndex(outlineRef).then((pageIndex) => {
                        cacheOutlineRef(doc, outlineRef, pageIndex);
                        getDestination(doc, dest).then((result) => res(result));
                    });
                }
                else {
                    res(normalizeDestination(pageIndex, destArray));
                }
            }
            else {
                const target = normalizeDestination(destArray[0], destArray);
                res(target);
            }
        });
    });
};
