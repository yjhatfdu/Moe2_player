export class EventBase {
    //提供事件处理功能
    listeners = {};

    dispatchEvent(event, args?) {
        if (!this.listeners[event]) {
            return
        }
        for (let i in this.listeners[event]) {
            let l = this.listeners[event][i];
            l.listener(args, this);
            if (l.useCapture) {
                return
            }
        }
    }

    addEventListener(event, listener, useCapture = false) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }
        this.listeners[event].push({listener: listener, useCapture: useCapture})
    }

    removeAllEventListenersOfEvent(event: string) {
        this.listeners[event] = [];
    }
}