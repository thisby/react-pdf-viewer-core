export function createStore(initialState) {
    let state = initialState || {};
    const listeners = {};
    const update = (key, data) => {
        state = Object.assign(Object.assign({}, state), { [key]: data });
        (listeners[key] || []).forEach((handler) => handler(state[key]));
    };
    const get = (key) => state[key];
    return {
        subscribe(key, handler) {
            listeners[key] = (listeners[key] || []).concat(handler);
        },
        unsubscribe(key, handler) {
            listeners[key] = (listeners[key] || []).filter((f) => f !== handler);
        },
        update(key, data) {
            update(key, data);
        },
        updateCurrentValue(key, updater) {
            const currentValue = get(key);
            if (currentValue !== undefined) {
                update(key, updater(currentValue));
            }
        },
        get(key) {
            return get(key);
        },
    };
}
