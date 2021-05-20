import EventListeners from './eventListeners';

class UserWebRTC extends EventListeners{
    constructor() {
        super();
        this._user = {id: '', username: '', roomId: ''};
        this._isCameraOn = false;
        this._localStream = null;
        this._streams = {};
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
    }

    get localId() {
        return this._id;
    }

    set localId(streamId) {
        this._id = streamId;
        this.addStream(streamId, this._localStream);
    }

    get localStream() {
        return this._localStream;
    }

    get isCameraOn() {
        return this._isCameraOn;
    }

    setLocalStream(stream, success) {
        if (success) {
            this._localStream = stream;
            this._isCameraOn = true;
        } else {
            this._isCameraOn = false;
        }
    }


    addStream(id, stream) {
        this._streams[id] = stream;
        this._eventListeners[`streamAdded-${id}`]?.forEach(i => {
            if (this._streams[id] !== undefined)
                i(this._streams[id])
        });
        if (this._id === id) {
            this._localStream = this._streams[id];
        }
        console.log(this._streams);
    }

    getTrack(id, type) {
        let track;
        if (this._streams[id] === undefined) {
            console.warn('Stream doesn\'t exist', id);
            return undefined;
        }
        switch (type) {
            case 'audio':
                track = this._streams[id].getAudioTracks()[0];
                break;
            case 'video':
                track = this._streams[id].getVideoTracks()[0];
                break;
            default:
                console.warn('Unknown stream type', type);
                return undefined;
        }
        return track;
    }


    getState(id, type) {
        return this.getTrack(id, type) ?? {enabled: false};
    }


    toggleStream(id, type) {
        let track = this.getTrack(id, type);
        if (track !== undefined) {
            track.enabled = !track.enabled;
            this._eventListeners[`streamToggled-${id}`]?.forEach(i => {
                if (this._streams[id] !== undefined)
                    i(this._streams[id])
            });
        }
        return track ?? {enabled: false};
    }


    removeStream(id) {
        if (this._streams[id] !== undefined)
            delete this._streams[id];
    }


    getStream(id) {
        return this._streams[id];
    }

}

export const currentUserWebRTC = new UserWebRTC();