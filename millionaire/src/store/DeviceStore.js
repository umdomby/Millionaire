import {makeAutoObservable} from "mobx";

export default class DeviceStore {

    constructor() {
        this._username = ''
        this._webSocket = {}
        this._connected = false
        this._close = true
        makeAutoObservable(this)
    }

    get username() {
        return this._username;
    }

    setUsername(value) {
        this._username = value;
    }

    get webSocket() {
        return this._webSocket;
    }

    setWebSocket(value) {
        this._webSocket = value;
    }

    get connected() {
        return this._connected;
    }

    setConnected(value) {
        this._connected = value;
    }

    get close() {
        return this._close;
    }

    setClose(value) {
        this._close = value;
    }

}
