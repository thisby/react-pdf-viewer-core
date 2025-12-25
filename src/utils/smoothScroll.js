import { ScrollDirection } from '../structs/ScrollDirection';
const EPS = 0.0001;
export const smoothScroll = (ele, scrollDirection, targetPosition, duration, easing = (t) => t, onReachTarget = () => { }) => {
    let top = 0;
    let left = 0;
    let reachTarget = false;
    switch (scrollDirection) {
        case ScrollDirection.Horizontal:
            left = ele.scrollLeft;
            top = 0;
            break;
        case ScrollDirection.Both:
            left = ele.scrollLeft;
            top = ele.scrollTop;
            break;
        case ScrollDirection.Vertical:
        default:
            left = 0;
            top = ele.scrollTop;
            break;
    }
    const markTargetReached = () => {
        if (!reachTarget) {
            reachTarget = true;
            ele.scrollLeft = targetPosition.left;
            ele.scrollTop = targetPosition.top;
            onReachTarget();
        }
    };
    if (Math.abs(top - targetPosition.top) <= EPS && scrollDirection === ScrollDirection.Vertical) {
        markTargetReached();
        return;
    }
    if (Math.abs(left - targetPosition.left) <= EPS && scrollDirection === ScrollDirection.Horizontal) {
        markTargetReached();
        return;
    }
    let startTime = -1;
    let requestId;
    const offset = {
        left: left - targetPosition.left,
        top: top - targetPosition.top,
    };
    const loop = (currentTime) => {
        if (startTime === -1) {
            startTime = currentTime;
        }
        const time = currentTime - startTime;
        const percent = Math.min(time / duration, 1);
        const easedPercent = easing(percent);
        const updatePosition = {
            left: left - offset.left * easedPercent,
            top: top - offset.top * easedPercent,
        };
        switch (scrollDirection) {
            case ScrollDirection.Horizontal:
                ele.scrollLeft = updatePosition.left;
                break;
            case ScrollDirection.Both:
                ele.scrollLeft = updatePosition.left;
                ele.scrollTop = updatePosition.top;
                break;
            case ScrollDirection.Vertical:
            default:
                ele.scrollTop = updatePosition.top;
                break;
        }
        if (Math.abs(updatePosition.top - targetPosition.top) <= EPS &&
            Math.abs(updatePosition.left - targetPosition.left) <= EPS &&
            !reachTarget) {
            window.cancelAnimationFrame(requestId);
            markTargetReached();
        }
        if (time < duration) {
            requestId = window.requestAnimationFrame(loop);
        }
        else {
            window.cancelAnimationFrame(requestId);
        }
    };
    requestId = window.requestAnimationFrame(loop);
};
