import { Player } from "../Player";
import { Renderer } from "./Renderer";
import { LayoutManager } from "./LayoutManager";
import { DanmakuItem } from "./DanmakuItem";
import { EventBase } from "../eventBase";
export declare class DanmakuManager extends EventBase {
    p: number;
    drawSettings: {
        color: string;
        fontFamily: string;
        fontSize: number;
        strokeColor: string;
        strokeWidth: number;
        pixelRatio: number;
        p: number;
        duration: number;
        rowSpace: number;
    };
    width: number;
    height: number;
    renderer: Renderer;
    layoutManager: LayoutManager;
    canvas: HTMLCanvasElement;
    player: Player;
    isPlaying: boolean;
    private _visible;
    forceUpdate: boolean;
    networkManager: any;
    visible: boolean;
    opacity: number;
    constructor(vid: any);
    init(player: any): void;
    loadDanmaku(src: string, type?: string): void;
    useVR: any;
    resize(): void;
    update(): void;
    play(): void;
    pause(): void;
    seeking(time: any): void;
    seek(): void;
    sendDanmaku(content: DanmakuItem): void;
    setInitialDanmakuList(list: Array<DanmakuItem>): void;
}
export declare class NetworkManager extends EventBase {
    dmkManager: any;
    socket: any;
    vid: any;
    constructor(vid: any, dmkmanager: any);
    send(dmk: any): void;
}
export declare class DMKParser {
    static parseBilibili(xmlString: string): DanmakuItem[];
    static parseAcfun(list: Array<any>): DanmakuItem[];
    static parse(content: any, type: any): any;
}
