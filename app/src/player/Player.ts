/**
 * Created by yjh on 15/10/21.
 */
    ///<reference path='../danmaku/danmakuManager.ts'/>
module Moe2{
    var DEBUG=false;

    function log(info){
            if(DEBUG){
                console.log(info)
            }
        }
    function createEle(tag:string,classname:string){
        var newEle=document.createElement(tag);
        newEle.className=classname;
        return newEle
    }
    export class EventBase {
        //提供事件处理功能
        listeners = {};

        dispatchEvent(event, args?) {
            if (!this.listeners[event]) {
                return
            }
            for (var i in this.listeners[event]) {
                var l = this.listeners[event][i];
                l.listener( args,this);
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

        removeAllEventListenersOfEvent(event:string) {
            this.listeners[event] = [];
        }
    }

    export enum PlayerEvent{
        play,
        pause,
        ready,
        error,
        timeupdate,
        resize,
        enterfullscreen,
        exitfullscreen,
        seeking,
        seeked,
        buffer
    }



    export class Player extends EventBase{
        containerEl:HTMLElement;
        videoEl;
        playerEl:HTMLElement;
        danmakuManager:Danmaku.DanmakuManager;
        controlLayer:UI.ControlLayer;
        fullscreenState:boolean;
        duration:number;
        touchMode:boolean;

        seekingTime:number=0;

        get currentTime(){
            return this.videoEl.currentTime;
        }
        set currentTime(v){
            this.seeked(v);
        }

        get volume(){
            return this.videoEl.volume
        }
        set volume(v){
            this.videoEl.volume=v
        }

        get isPlaying(){
            return !this.videoEl.paused
        }



        constructor(container:HTMLElement,title=null,vid=null){
            super();
            PlayerEventBus=new Moe2.EventBase();
            this.containerEl=container;
            container.innerHTML='<video webkit-playsinline></video>';
            //this.videoEl=document.createElement('video');
            //this.videoEl.outerHTML='<video webkit-playsinline></video>';
            //this.videoEl.autoplay=true;
            //this.videoEl.preload='auto';
            //this.videoEl['webkitPlaysinline']=true;
            this.videoEl=this.containerEl.querySelector('video');
            this.controlLayer=new UI.ControlLayer(this,title);
            this.danmakuManager=new Danmaku.DanmakuManager(vid);
            this.danmakuManager.init(this);
            this.containerEl.appendChild(this.danmakuManager.canvas);
            this.danmakuManager.resize();
            this.containerEl.appendChild(this.controlLayer.element);
            this.containerEl.appendChild(this.videoEl);
            this.touchMode=!!document['createTouch'];
            this.videoEl.addEventListener('play',function(){
                this.dispatchEvent(PlayerEvent.ready)
            }.bind(this));

            this.videoEl.load();
            this.videoEl.addEventListener('playing',function(){
                this.dispatchEvent(PlayerEvent.play);
            }.bind(this));
            this.videoEl.addEventListener('pause',function(){
                this.dispatchEvent(PlayerEvent.pause);
            }.bind(this));
            this.videoEl.addEventListener('error',function(){
                this.dispatchEvent(PlayerEvent.error)
            }.bind(this));
            this.videoEl.addEventListener('seeked',function(){
                this.dispatchEvent(PlayerEvent.seeked)
            }.bind(this));
            this.videoEl.addEventListener('timeupdate',function(){
                this.dispatchEvent(PlayerEvent.timeupdate);
                localStorage.setItem('lasttime:'+vid,this.videoEl.currentTime)
            }.bind(this));
            this.videoEl.addEventListener('loadedmetadata', function () {
                this.duration=this.videoEl.duration;
                this.dispatchEvent(PlayerEvent.resize);
                var lasttime=localStorage.getItem('lasttime:'+vid);
                if(lasttime){
                    this.videoEl.currentTime=lasttime
                }

            }.bind(this));
            window.addEventListener('resize',function(){
                this.dispatchEvent(PlayerEvent.resize);
                //PlayerEventBus.dispatchEvent('resize');
            }.bind(this));
            window.addEventListener('keypress',function(e){
               if( !(e.target['nodeName'] == 'TEXTAREA' || e.target['nodeName'] == 'INPUT')){
                    e.preventDefault();
                   if(e.keyCode==32){
                       if(this.isPlaying){
                           this.pause()
                       } else{
                           this.play();
                       }
                   }

               }
            }.bind(this));

            window.addEventListener('keyup',function(e){
                if( !(e.target['nodeName'] == 'TEXTAREA' || e.target['nodeName'] == 'INPUT')){
                    e.preventDefault();
                    if(e.keyCode==37){
                        this.seek(Math.max(0,this.currentTime-15))
                    }else if (e.keyCode==39){
                        this.seek(Math.min(this.duration,this.currentTime+15))
                    }

                }
            }.bind(this));



            document.addEventListener("webkitfullscreenchange",function(){
              if(document['webkitIsFullScreen']===true){
                    this.fullscreenState=true;
                  this.containerEl.classList.add('fullscreen');
                  setTimeout(function(){  this.videoEl.style.marginTop=(window.innerHeight-this.videoEl.offsetHeight)/2+'px';

                      this.danmakuManager.resize();
                  }.bind(this),300);
              }else{
                  this.fullscreenState=false;
                  this.containerEl.classList.remove('fullscreen');
                 this.videoEl.style.marginTop=null;
                  this.danmakuManager.resize();
              }
            }.bind(this));


            this.containerEl.addEventListener('contextmenu',function(e){
                e.preventDefault();
                if(this.contextMenu){
                    this.contextMenu.dispose();
                    this.contextMenu=null;
                }
                this.contextMenu=new UI.ContextMenu();
                this.containerEl.appendChild(this.contextMenu.element);
                this.contextMenu.element.style.left=e.offsetX+'px';
                this.contextMenu.element.style.top=e.offsetY+'px';
                this.contextMenu.addEventListener('CLICK',function(method){
                    switch (method){
                        case('pause'):{
                            this.pause();
                            break
                        }
                            case('togleGPU'):{
                                 if(localStorage.getItem('useGPU')=='true'){
                                     localStorage.setItem('useGPU','false')
                                 }else{
                                     localStorage.setItem('useGPU','true')
                                 }
                              location.reload()
                            }
                    }
                    this.contextMenu.dispose();
                    this.contextMenu=null;
                }.bind(this));
            }.bind(this));
            window.addEventListener('click',function(e){
                if(this.contextMenu && e.button==0){
                    this.contextMenu.dispose();
                    this.contextMenu=null;
                }
            }.bind(this),false);
            setInterval(this.checkBufferState.bind(this),250)
        }


        lastUpdateTime=-1;
        buffering=false;
        checkBufferState(){
            if(this.videoEl.currentTime==this.lastUpdateTime&&(!this.buffering)){
                this.buffering=true;
                this.dispatchEvent(PlayerEvent.buffer)
            }else if(this.videoEl.currentTime!=this.lastUpdateTime&&(this.buffering||this.isPlaying)){
                this.buffering=false;
                this.dispatchEvent(PlayerEvent.play)
            }
            this.lastUpdateTime=this.videoEl.currentTime
        }


        initVideo(src:string){
            this.videoEl.src=src;
        }
        loadDanmaku(src,type='bilibili'){
            this.danmakuManager.loadDanmaku(src,type)
        }

        play(){
            this.videoEl.play()
        }

        pause(){
            this.videoEl.pause()
        }
        seek(time){
            this.videoEl.currentTime=time;
            this.play()
        }
        seeked(time){
            this.videoEl.currentTime=time;
        }
        seeking(time){
            if(!this.touchMode){
                this.dispatchEvent(PlayerEvent.seeking,time)
            }
        }
        enterFullScreen(){
            if (this.containerEl['requestFullscreen']) {
                this.containerEl['requestFullscreen']();
            } else if (this.containerEl['msRequestFullscreen']) {
                this.containerEl['msRequestFullscreen']();
            } else if (this.containerEl['mozRequestFullScreen']) {
                this.containerEl['mozRequestFullScreen']();
            } else if (this.containerEl['webkitRequestFullscreen']) {
                this.containerEl['webkitRequestFullscreen']();
            }else if(this.videoEl['webkitEnterFullscreen']){
                this.videoEl['webkitEnterFullscreen']();
            }
        }

        get use3D(){
            return localStorage.getItem('useGPU')=='true'||false
        }
        set use3D(v){
            localStorage.setItem('useGPU',v.toString());
            location.reload()
        }
        get useVR(){
            let useVR= localStorage.getItem('useVR')=='true'||false;
            if(useVR){
                this.containerEl.classList.add('vr');
                this.danmakuManager.resize()
            }else{
                this.containerEl.classList.remove('vr')
            }
            return useVR
        }
        set useVR(v){
            let isMobile=/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
            if(!isMobile){
                alert('请使用移动设备配合cardboard观看!(oculus等我的到货后支持)');
                return
            }
            if(/iPhone|iPod/.test(navigator.userAgent)&&(!navigator['standalone'])){
                alert('请回到首页然后点击Safari菜单中的添加到主屏幕,然后从主屏幕中的图标进入本站观看VR模式');
                return
            }

            localStorage.setItem('useVR',v.toString());
            if(!this.use3D){
                this.use3D=true;
            }else{
                this.danmakuManager.useVR=v
            }
            if(this.useVR){
                this.containerEl.classList.add('vr')
            }else{
                this.containerEl.classList.remove('vr')
            }
        }

        exitFullScreen(){
            if(document['exitFullscreen']){
                document['exitFullscreen']()
            }else if(document['webkitExitFullscreen']) {
                document['webkitExitFullscreen']()
            }else if(document['msExitFullscreen']){
                document['msExitFullscreen']()
            }else if(document['mozCancelFullScreen']){
                document['mozCancelFullScreen']()
            }
            this.danmakuManager.resize()


        }
        get bufferRange(){
            if(this.videoEl.buffered.length==0){
                return[0,0]
            }
            return [this.videoEl.buffered.start(0)/this.duration,this.videoEl.buffered.end(0)/this.duration]
        }

        toogleDanmaku(){
            this.danmakuManager.visible=!this.danmakuManager.visible
        }




    }

    module UI{

        enum ProgressBarEvent{
            startSeek,
            seeking,
            seeked
        }

        export class ContextMenu extends EventBase{
            element:HTMLElement;
            constructor(){
                super();
                this.initDom();
            }
            initDom(){
                var dom=`<div class="wrapper">
              <ul>
                <li><a >Moe2 player 1.0.0</a></li>
              </ul>
              <hr/>
               <ul>
                    <li><a data-role='pause'>暂停播放</a></li>
               </ul>
               <hr/>
              <ul>
                       <li>
                             <a data-role="togleGPU">${localStorage.getItem('useGPU')=='TRUE'?'关闭3D弹幕':'开启3D弹幕'}</a>
                       </li>
                       <li>
                            <a >显示视频信息</a>
                       </li>
              </ul>
              <hr/>
              <ul>
                <li><a >设置...</a></li>
                <li><a >全局设置...</a></li>
                <li><a >关于 Adobe Flash Player 18.0.0.290</a></li>
              </ul>
            </div>`;
                this.element=createEle('div','flake flake_osx');
                this.element.innerHTML=dom;
                this.element.addEventListener('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble=true;
                    this.dispatchEvent('CLICK',e.target.getAttribute('data-role'))
                }.bind(this),true)
            }
            dispose(){
                this.element.parentElement.removeChild(this.element);
                this.element=null;
                this.listeners=null;
            }
        }

        class ProgressBar extends EventBase{
            value:number=0;
            private player:Player;
            element:HTMLElement;
            private totalRangeEl:HTMLElement;
            private currentRangeEl:HTMLElement;
            private bufferedRangeEl:HTMLElement;
            private indicatorEL:HTMLElement;
            private indInner:HTMLElement;
            private touchMode:boolean;
            private downEvent:string;
            private moveEvent:string;
            private upEvent:string;
            private sliderStartX:number;
            touchDown=false;
            private downValue;
            constructor(player:Player,touchMode=!!document['createTouch']){
                super();
                this.player=player;
                this.element=createEle('div','progress-wrapper');
                this.element.appendChild(this.totalRangeEl= createEle('div','player-progress-bar'));
                this.bufferedRangeEl=createEle('div','buffer-range');
                this.totalRangeEl.appendChild(this.bufferedRangeEl);
                this.currentRangeEl=createEle('div','current-range');
                this.totalRangeEl.appendChild(this.currentRangeEl);

                this.indicatorEL=createEle('div','indicator');
                this.indicatorEL.appendChild(this.indInner=createEle('div','ind-inner'));
                this.totalRangeEl.appendChild(this.indicatorEL);
                this.touchMode=touchMode;
                this.downEvent=touchMode?'touchstart':'mousedown';
                this.moveEvent=touchMode?'touchmove':'mousemove';
                this.upEvent=touchMode?'touchend':'mouseup';

                this.element.addEventListener(this.downEvent,function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    this.touchDown=true;
                    this.sliderStartX=e.clientX-e.offsetX;
                    if(e.target==this.indicatorEL||e.target==this.indInner){
                        this.sliderStartX-=e.target.offsetLeft;
                        if(e.target!=this.indicatorEL){
                            this.sliderStartX-=this.indicatorEL.offsetLeft;
                        }
                    }
                    var value=this.getPageX(e)/this.element.offsetWidth;
                    this.downValue=value;

                    if(e.target==this.indicatorEL||e.target==this.indInner){
                        return
                    }
                    this.setValue(value);
                    this.dispatchEvent(ProgressBarEvent.startSeek);
                }.bind(this),true);
                window.addEventListener(this.moveEvent,function(e){
                    if(this.touchDown){
                        e.preventDefault();
                        var value=this.getPageX(e)/this.element.offsetWidth;
                        this.setValue(value);
                        this.player.seeking(value*player.duration)
                    }
                }.bind(this));
                window.addEventListener(this.upEvent,function(e){
                    if(this.touchDown){
                        e.preventDefault();
                        e.stopPropagation();
                        this.touchDown=false;
                        var value=this.getPageX(e)/this.element.offsetWidth;
                        if(value==this.downValue){
                            return
                        }
                        this.setValue(value);
                        this.dispatchEvent(ProgressBarEvent.seeked);

                    }
                }.bind(this),true);
                window.addEventListener('touchcancel',function(){
                    this.touchDown=false;
                }.bind(this))
            }


            getPageX (e) {
                if (this.touchMode) {
                    return e.changedTouches[0].pageX
                } else {
                    return e.clientX - this.sliderStartX
                }
            }
            private seeking=false;
            set currentValue(v){
                if (!this.touchDown){
                    this.setValue(v);
                }
            }
            private setValue(v){
                if(v>1){
                    v=1
                }
                this.currentRangeEl.style.width=v*100+'%';
                this.indicatorEL.style.left=v*100+'%';
                this.value=v;
            }
            // 应该设置[start,end]
            set bufferRange(v:Array<number>){
                this.bufferedRangeEl.style.left=v[0]*100+'%';
                this.bufferedRangeEl.style.width=(v[1]-v[0])*100+'%';
            }

        }


        export class ControlLayer extends EventBase{
            element:HTMLElement;
            progressBar:ProgressBar;
            player:Player;
            controlPanelEl:HTMLElement;
            private playIconEl:HTMLElement;
            private fullScreenIcon:HTMLElement;
            private danmakuIconEl:HTMLElement;
            private icon3DEl;
            private vrIconEl;
            private touchMode:boolean;
            private downEvent:string;
            private moveEvent:string;
            private upEvent:string;
            private currentTimeEl:HTMLElement;
            private durationEl:HTMLElement;
            lastActive=0;
            visible=true;


            constructor(player:Player,title=null,touchMode=!!document['createTouch']){
                super();
                this.player=player;
                this.progressBar=new ProgressBar(player);
                this.element=createEle('div','control-layer');
                this.controlPanelEl=createEle('div','control-panel');
                this.element.appendChild(this.controlPanelEl);
                this.controlPanelEl.appendChild(this.progressBar.element);
                if(title){
                    var titleEl=createEle('div','video-title');
                    titleEl.innerHTML=`<h3>${title}</h3>`;
                    this.element.appendChild(titleEl);
                }
                var playIconElDiv=createEle('div','');
                    this.playIconEl=createEle('i','fa fa-lg fa-play play-icon');
                playIconElDiv.appendChild(this.playIconEl);

                this.controlPanelEl.appendChild(this.fullScreenIcon=createEle('i','fa fa-lg fa-arrows-alt fullscreen-icon'));
                this.controlPanelEl.appendChild(this.danmakuIconEl=createEle('i','fa fa-lg fa-bars danmaku-icon icon-active'));
                this.controlPanelEl.appendChild(this.icon3DEl=createEle('span','fa fa-lg danmaku-icon'));
                this.icon3DEl.innerHTML='<strong>3D</strong>';
                if(this.player.use3D){
                    this.icon3DEl.classList.add('icon-active')
                }
                this.controlPanelEl.appendChild(this.vrIconEl=createEle('span','fa fa-lg danmaku-icon'));
                this.vrIconEl.innerHTML='<strong>VR</strong>';
                if(this.player.useVR){
                    this.vrIconEl.classList.add('icon-active')
                }
                this.controlPanelEl.appendChild(playIconElDiv);
                var timeind=createEle('div','time-indicator');
                timeind.appendChild(this.currentTimeEl=createEle('span','current-time'));
                timeind.appendChild(this.durationEl=createEle('span','total-time'));
                this.controlPanelEl.appendChild(timeind);
                this.touchMode=touchMode;
                this.downEvent=touchMode?'touchstart':'mousedown';
                this.moveEvent=touchMode?'touchmove':'mousemove';
                this.upEvent=touchMode?'touchend':'mouseup';
                this.player.addEventListener(PlayerEvent.ready,function(){
                    this.durationEl.innerHTML='/'+this.parseTime(this.player.duration);
                    this.currentTimeEl.innerHTML=this.parseTime(this.player.currentTime)
                }.bind(this));
                this.player.addEventListener(PlayerEvent.timeupdate,this.updateTime.bind(this));
                this.progressBar.addEventListener(ProgressBarEvent.startSeek,function(){
                    this.player.seek(this.progressBar.value*this.player.duration)
                }.bind(this),true);
                this.progressBar.addEventListener(ProgressBarEvent.seeked,function(){
                    this.player.seek(this.progressBar.value*this.player.duration)
                }.bind(this));
                playIconElDiv.addEventListener(this.upEvent,function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    this.tooglePlay(e);
                    this.lastActive=Date.now();
                }.bind(this),true);
                this.fullScreenIcon.addEventListener(this.upEvent,this.toogleFS.bind(this),true);
                this.danmakuIconEl.addEventListener(this.upEvent,this.toogleDanmaku.bind(this),true);
                this.icon3DEl.addEventListener(this.upEvent,this.toogle3D.bind(this),true);
                this.vrIconEl.addEventListener(this.upEvent,this.toogleVR.bind(this),true);
                this.player.addEventListener(PlayerEvent.play,function(){
                    this.playIconEl.classList.remove('fa-play');
                    this.playIconEl.classList.add('fa-pause');
                    this.durationEl.innerHTML='/'+this.parseTime(this.player.duration);
                }.bind(this));
                this.player.addEventListener(PlayerEvent.pause,function(){
                    this.playIconEl.classList.remove('fa-pause');
                    this.playIconEl.classList.add('fa-play')
                }.bind(this));



                this.element.addEventListener(this.upEvent,this.detectDbclick.bind(this),false);






                if(!touchMode){
                    this.element.addEventListener('mousemove',function(e){
                        if(!this.player.isPlaying){
                            return
                        }
                        this.lastActive=Date.now();
                        this.show();
                        //if(this.element.offsetHeight*0.68<e.clientY-this.element.offsetTop+window.pageYOffset){
                        //    this.show();
                        //    this.lastActive=Date.now();
                        //}else{
                        //   this.hide()
                        //}

                    }.bind(this));
                }else{
                    this.element.addEventListener('touchend',function(){
                        if(!this.player.isPlaying){
                            return
                        }
                        if(this.visible){
                            this.hide();
                        }else{
                            this.lastActive=Date.now();
                            this.show();
                        }

                    }.bind(this),false)
                }


                setInterval(function(){
                    if(this.player.isPlaying==false){
                     this.show();
                        return;
                    }
                    if(this.progressBar.touchDown){
                        this.lastActive=Date.now();
                        return
                    }
                    if(Date.now()-this.lastActive>2500){
                       this.hide();
                    }
                }.bind(this),500);

                if(touchMode){

                }else{

                }

                setTimeout(function(){this.element.classList.add('opacity')}.bind(this),2000)
            }

            show(){
                this.element.classList.remove('opacity');
                this.visible=true;
            }
            hide(){
                this.element.classList.add('opacity');
                this.visible=false
            }

            private parseTime(time:number):string{
                time=time||0;
                time=Math.round(time);
                var ss=time%60;
                var ssstr=ss<10?'0'+ss:''+ss;
                time=Math.floor(time/60);
                var mm=time%60;
                var mmstr=mm<10?'0'+mm:''+mm;
                var hh=Math.floor(time/60);
                var result=mmstr+':'+ssstr;
                if(hh>0){
                    result=''+hh+':'+result
                }
                return result
            }


            lastClickTime=0;
            detectDbclick(e){
                var now=Date.now();
                if(now-this.lastClickTime<400){
                    this.toogleFS(e)
                }else{
                    this.lastClickTime=now
                }
            }



            updateTime(){
                this.progressBar.currentValue=this.player.currentTime/this.player.duration;
                this.progressBar.bufferRange=this.player.bufferRange;
             this.currentTimeEl.innerHTML=this.parseTime(this.player.currentTime)
            }
            tooglePlay(e){
                if(e){
                    e.stopPropagation();
                }

                if(this.player.isPlaying){
                    this.player.pause()
                }else{
                    this.player.play()
                }
            }
            toogleFS(e){
                if(e){
                    e.stopPropagation();
                }
                    if(this.player.fullscreenState){
                        this.player.exitFullScreen()
                    }else{
                        this.player.enterFullScreen()
                    }
            }
            toogleDanmaku(e){
                if(e){
                    e.stopPropagation();
                }
                this.player.toogleDanmaku();
                if(this.player.danmakuManager.visible){
                    this.danmakuIconEl.classList.add('icon-active')
                }else{
                    this.danmakuIconEl.classList.remove('icon-active')
                }
            }
            toogle3D(e){
                if(e){
                    e.stopPropagation();
                }
                this.player.use3D=!this.player.use3D

            }
            toogleVR(e){
                if(e){
                    e.stopPropagation();
                }
                this.player.useVR=!this.player.useVR;
                if(this.player.useVR){
                    this.vrIconEl.classList.add('icon-active')
                }else{
                    this.vrIconEl.classList.remove('icon-active')
                }
            }


        }
    }

    export var PlayerEventBus=new EventBase()
}