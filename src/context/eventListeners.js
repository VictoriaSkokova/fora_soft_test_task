class EventListeners {
    constructor() {
        this._eventListeners = {};
    }

    addEventListener(type, handler) {
        if (this._eventListeners[type] === undefined)
            this._eventListeners[type] = [];
        this._eventListeners[type].push(handler);
    }

    removeEventListener(type, handler) {
        if (this._eventListeners[type] !== undefined){
            this._eventListeners[type] = this._eventListeners[type]
                .filter(i => i.toString() !== handler.toString());
            if(this._eventListeners[type].length === 0)
                delete this._eventListeners[type];
        }
    }
}

export default EventListeners;