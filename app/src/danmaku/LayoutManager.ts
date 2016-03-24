/**
 * Created by yjh on 15/10/24.
 */
    ///<reference path='danmakuManager.ts'/>
module Moe2{
    export module Danmaku{
    export class LayoutManager{

        danmakuManager:DanmakuManager;
        initialList:Array<DanmakuItem>=[];
        appendList:Array<DanmakuItem>=[];
        initialListRange=[0,0];
        appendListRange=[0,0];

        currentTime:number=0;
        startTime:number=0;
        videoStartTime:number=0;
        rowCount:number=0;
        rowTail:Array<DanmakuItem>=[];
        staticRow:Array<DanmakuItem>=[];
        lastSeekingTime:number=0;
        lastSeekingDirectionRightForward:boolean=true;


        isPlaying:boolean=false;


        constructor(manager:DanmakuManager){
            this.danmakuManager=manager;
        }

        loadDanmakuList(dmkList:Array<DanmakuItem>){
            this.initialList=dmkList;
            this.initialListRange=[0,0];
            this.rowTail=[];
            this.staticRow=[];
            this.initialList.sort(function(a, b) {
                return a.time - b.time;
            });
        }

        loadDanmakuListQM(dmkList:Array<any>){
            for (var i = 0; i < dmkList.length; ++i) {
                this.initialList.push(this.parseItemQM(dmkList[i]));
            }
            this.initialList.sort(function(a, b) {
                return a.time - b.time;
            });
        }

        parseItemQM(dmk){
            var danmakuStyle = dmk[6];
            var color = (danmakuStyle && danmakuStyle[1]) ? danmakuStyle[1] : this.danmakuManager.drawSettings.color;
            var fontSize = (danmakuStyle && danmakuStyle[2]) ? danmakuStyle[2] : this.danmakuManager.drawSettings.fontSize;
            return new DanmakuItem(this.danmakuManager, dmk[3], dmk[2] ? dmk[2] :0.1, dmk[10], color, fontSize);
        }


        start(){
            this.isPlaying=true;
            this.seek()

        }

        pause(){
            this.isPlaying=false;
        }

        seek(time=null){
            this.isPlaying = this.danmakuManager.isPlaying;
            var currentTime = time||this.danmakuManager.player.currentTime;
            this.currentTime = currentTime;
            this.videoStartTime = currentTime;
            this.rowTail = [];
            this.staticRow = [];
            this.initialListRange = [0, 0];
            this.appendListRange = [0, 0];
            this.startTime = Date.now() / 1000;
            this.update(true);
        }

        seeking(time){
            this.isPlaying = false;
            var direction=(time-this.lastSeekingTime)>0;
            if(direction!=this.lastSeekingDirectionRightForward){
                this.rowTail = [];
                this.staticRow = [];
                this.lastSeekingDirectionRightForward=direction
            }
            this.lastSeekingTime = time;
            this.update(true, time);
        }


        insert(item:DanmakuItem){
            var drawSettings = this.danmakuManager.drawSettings;
            var currentTime = this.getTime();
            this.appendList.push(item);
            this.appendList.sort(function(a, b) {
                return a.time - b.time;
            });
            if ((item.time < currentTime + 1.5*drawSettings.duration) && (item.time > currentTime-1)) {
                item.drawBuffer();
                this.arrange(item,this.getTime());
            }
            this.getRange(this.appendList, currentTime, this.appendListRange);
        }

        resize(width:number,height:number){
            var drawSettings = this.danmakuManager.drawSettings;
            this.rowCount = Math.floor(height / (drawSettings.fontSize + drawSettings.rowSpace)) - 2;
        }
        getTime(){
            if (this.isPlaying) {
                return this.currentTime = Date.now() * 0.001 - this.startTime + this.videoStartTime;
            } else {
                return this.currentTime;
            }
        }

        arrange(item:DanmakuItem, currentTime:number){
            var drawSettings = this.danmakuManager.drawSettings;
            var duration = drawSettings.duration,
                width = this.danmakuManager.width;
            if (item.type == DanmakuType.NORMAL) {
                var min = Number.MAX_VALUE;
                var minRow;
                for (var i = 0; i < this.rowCount; i++) {
                    if (!this.rowTail[i]) {
                        this.rowTail[i] = item;
                        item.row = i;
                        return;
                    }
                    var rowItem = this.rowTail[i];
                    if(!rowItem.buffer){
                        this.rowTail[i] = item;
                        item.row = i;
                        return;
                    }
                    if(rowItem.time>currentTime){
                        this.rowTail[i] = item;
                        item.row = i;
                        return;
                    }
                    if (rowItem.time < item.time - rowItem.width/(this.danmakuManager.canvas.width+2*rowItem.width)*duration) {
                        this.rowTail[i] = item;
                        item.row = i;
                        return;
                    }
                    if (item.time - rowItem.width / this.danmakuManager.p / (width + rowItem.width / this.danmakuManager.p) * duration > rowItem.time) {
                        this.rowTail[i] = item;
                        item.row = i;
                        return;
                    }
                    if (rowItem.time < min) {
                        min = rowItem.time;
                        minRow = i;
                    }
                }
                this.rowTail[minRow] = item;
                item.row = minRow;
            }
            if (item.type == DanmakuType.TOP) {
                var min = Number.MAX_VALUE;
                var minRow;
                for (var i = 0; i < this.rowCount; i++) {
                    if (!this.staticRow[i]) {
                        this.staticRow[i] = item;
                        item.row = i;
                        return;
                    }
                    if (item.time - this.staticRow[i].time > duration) {
                        this.staticRow[i] = item;
                        item.row = i;
                        return;
                    }
                    if (this.staticRow[i].time < min) {
                        min = this.staticRow[i].time;
                        minRow = i;
                    }
                }
                this.staticRow[minRow] = item;
                item.row = minRow;
            }
            if (item.type == DanmakuType.BOTTOM) {
                var min = Number.MAX_VALUE;
                var minRow;
                for (var i = this.rowCount - 1; i >= 0; i--) {
                    if (!this.staticRow[i]) {
                        this.staticRow[i] = item;
                        item.row = i;
                        return;
                    }
                    if (item.time - this.staticRow[i].time > duration) {
                        this.staticRow[i] = item;
                        item.row = i;
                        return;
                    }
                    if (this.staticRow[i].time < min) {
                        min = this.staticRow[i].time;
                        minRow = i;
                    }
                }
                this.staticRow[minRow] = item;
                item.row = minRow;
            }
        }


        getRange(list:Array<DanmakuItem>,currentTime:number, range:Array<number>){
            var drawSettings = this.danmakuManager.drawSettings;
            var duration = drawSettings.duration;
            if (!!list[range[1]]) {
                while ((list[range[1]].time < currentTime) && range[1] < list.length) {
                    range[1]++;
                    if (!list[range[1]]) {
                        break;
                    }
                    else {
                        if (list[range[1]].time > currentTime - 3 * duration) {
                            list[range[1]].drawBuffer();
                            this.arrange(list[range[1]], currentTime);
                        }

                    }
                }
            }
            if (!!list[range[0]]) {
                while ((list[range[0]].time < currentTime - duration) && range[0]+1 < list.length) {
                    range[0]++;
                    if (!list[range[0] - 1]) {
                        break;
                    }
                    else {
                        list[range[0] - 1].dropBuffer();
                    }
                }
            }
            if (!!list[range[0] - 1]) {
                while ((list[range[0] - 1].time > currentTime - duration) && (range[0] - 1) > 0) {
                    range[0]--;
                    if (!list[range[0] - 1]) {
                        break;
                    }
                    else {
                        if (list[range[0]].time < currentTime) {
                            list[range[0]].row = Math.round(Math.random() * this.rowCount);
                            list[range[0]].drawBuffer();
                        }
                    }
                }
            }
            if (!!list[range[1] - 1]) {
                while ((list[range[1] - 1].time > currentTime ) && (range[1] - 1) > 0) {
                    range[1]--;
                    if (!list[range[1] - 1]) {
                        break;
                    }
                    else {
                        list[range[1]].dropBuffer();
                    }
                }
            }
        }

        updateListPosition(start:number, end:number, list:Array<DanmakuItem>, currentTime:number){
            var drawSettings = this.danmakuManager.drawSettings;
            var duration = drawSettings.duration,
                width = this.danmakuManager.width;
            for (var i = start - 1; i <= end + 1; i++) {
                var item = list[i];
                if (!item) {
                    continue;
                }

                if (item.type == DanmakuType.NORMAL) {
                    item.left = width * drawSettings.p + (width * drawSettings.p + item.width) / duration * (item.time - currentTime);
                }
                if (item.type == DanmakuType.TOP || item.type == DanmakuType.BOTTOM) {
                    item.left = width * 0.5 * drawSettings.p - 0.5 * item.width;
                }
            }
        }

        update(force:boolean=false,time=null){
            this.isPlaying=this.danmakuManager.isPlaying;
            if (this.isPlaying || force) {
                var currentTime = time || this.getTime();
                this.getRange(this.initialList, currentTime, this.initialListRange);
                this.getRange(this.appendList, currentTime, this.appendListRange);
                this.updateListPosition(this.initialListRange[0], this.initialListRange[1], this.initialList, currentTime);
                this.updateListPosition(this.appendListRange[0], this.appendListRange[1], this.appendList, currentTime)
            }
        }

    }
}

}
