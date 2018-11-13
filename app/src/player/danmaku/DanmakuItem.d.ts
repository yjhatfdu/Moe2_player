/// <reference path="danmakuManager.d.ts" />
import { DanmakuManager } from "./danmakuManager";
export declare enum DanmakuType {
    NORMAL = 0,
    TOP = 1,
    BOTTOM = 2,
}
export declare class DanmakuItem {
    danmakuManager: DanmakuManager;
    content: string;
    time: number;
    type: DanmakuType;
    fontSize: number;
    color: string;
    row: number;
    left: number;
    buffer: any;
    width: number;
    height: number;
    texposStart: number;
    texposEnd: number;
    zpos: number;
    constructor(danmakuManager: any, content: any, time: any, type: any, color: any, fontSize: any);
    drawBuffer(): void;
    dropBuffer(): void;
}
