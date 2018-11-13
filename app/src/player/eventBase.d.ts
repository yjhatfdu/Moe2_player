export declare class EventBase {
    listeners: {};
    dispatchEvent(event: any, args?: any): void;
    addEventListener(event: any, listener: any, useCapture?: boolean): void;
    removeAllEventListenersOfEvent(event: string): void;
}
