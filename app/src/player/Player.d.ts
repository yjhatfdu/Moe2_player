import { DanmakuManager } from "./danmaku/danmakuManager";
import { EventBase } from "./eventBase";
export declare enum PlayerEvent {
    play = 0,
    pause = 1,
    ready = 2,
    error = 3,
    timeupdate = 4,
    resize = 5,
    enterfullscreen = 6,
    exitfullscreen = 7,
    seeking = 8,
    seeked = 9,
    buffer = 10,
    sendDanmaku = 11,
}
export declare class Player extends EventBase {
    containerEl: HTMLElement;
    videoEl: any;
    playerEl: HTMLElement;
    danmakuManager: DanmakuManager;
    controlLayer: ControlLayer;
    fullscreenState: boolean;
    duration: number;
    touchMode: boolean;
    isLive: boolean;
    contextMenu: ContextMenu;
    seekingTime: number;
    currentTime: any;
    volume: any;
    isPlaying: boolean;
    constructor(container: HTMLElement, title?: any, vid?: any);
    lastUpdateTime: number;
    buffering: boolean;
    checkBufferState(): void;
    initVideo(src: string): void;
    initHls(hlsUrl: string, isLive?: boolean): void;
    initFlv(flvUrl: string): void;
    loadDanmaku(src: any, type?: string): void;
    pushDanmaku(content: any, color?: string, type?: number, fontSize?: number): void;
    sendDanmaku(content: any, color?: string, type?: number, fontSize?: number): void;
    play(): void;
    pause(): void;
    seek(time: any): void;
    seeked(time: any): void;
    seeking(time: any): void;
    enterFullScreen(): void;
    use3D: boolean;
    useVR: boolean;
    exitFullScreen(): void;
    bufferRange: number[];
    toogleDanmaku(): void;
}
export declare class ContextMenu extends EventBase {
    element: HTMLElement;
    constructor();
    initDom(): void;
    dispose(): void;
}
export declare class ProgressBar extends EventBase {
    value: number;
    private player;
    element: HTMLElement;
    private totalRangeEl;
    private currentRangeEl;
    private bufferedRangeEl;
    private indicatorEL;
    private indInner;
    private touchMode;
    private downEvent;
    private moveEvent;
    private upEvent;
    private sliderStartX;
    touchDown: boolean;
    private downValue;
    constructor(player: Player, touchMode?: boolean);
    hide(): void;
    getPageX(e: any): any;
    private seeking;
    currentValue: any;
    private setValue(v);
    bufferRange: Array<number>;
}
export declare class ControlLayer extends EventBase {
    element: HTMLElement;
    progressBar: ProgressBar;
    player: Player;
    controlPanelEl: HTMLElement;
    private playIconEl;
    private fullScreenIcon;
    private danmakuIconEl;
    private icon3DEl;
    private dmkInput;
    private vrIconEl;
    private touchMode;
    private downEvent;
    private moveEvent;
    private upEvent;
    private currentTimeEl;
    private durationEl;
    lastActive: number;
    visible: boolean;
    constructor(player: Player, title?: any, touchMode?: boolean);
    show(): void;
    hide(): void;
    setliveMode(): void;
    private parseTime(time);
    lastClickTime: number;
    detectDbclick(e: any): void;
    updateTime(): void;
    tooglePlay(e: any): void;
    toogleFS(e: any): void;
    toogleDanmaku(e: any): void;
    toogle3D(e: any): void;
    toogleVR(e: any): void;
}
