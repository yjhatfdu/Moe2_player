/**
 * Created by yjh on 15/10/24.
 */
    ///<reference path='danmakuManager.ts'/>
module Moe2{
    export module Danmaku{
        export enum DanmakuType{
            NORMAL=0,
            TOP=1,
            BOTTOM=2
        }
        export class DanmakuItem{
            danmakuManager:DanmakuManager;
            content:string;
            time:number=0;
            type:DanmakuType=0;
            fontSize:number=0;
            color:string;
            row:number=0;
            left:number=0;
            buffer=null;
            width:number=0;
            height:number=0;
            texposStart:number=0;
            texposEnd:number=0;
            zpos:number=0;
            constructor(danmakuManager, content, time, type, color, fontSize){
                this.danmakuManager=danmakuManager;
                this.content=content;
                this.time=time;
                this.type=type?type:DanmakuType.NORMAL;
                this.color=color? color : danmakuManager.drawSettings.color;
                this.fontSize=fontSize||danmakuManager.drawSettings.fontSize;
            }

            drawBuffer(){
                if(!this.buffer){
                    this.danmakuManager.renderer.drawItemBuffer(this);
                }
            }
            dropBuffer(){
                this.buffer=null;
            }

            }
    }
}