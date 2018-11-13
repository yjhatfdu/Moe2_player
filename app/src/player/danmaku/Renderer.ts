/**
 * Created by yjh on 15/10/24.
 */
import {DanmakuManager} from "./danmakuManager";
import {DanmakuItem} from "./DanmakuItem";

export class Renderer {
    canvas: HTMLCanvasElement;

    danmakuManager: DanmakuManager;

    width: number;
    height: number;

    //experimental
    enableVR = false;

    constructor(danmakuManager: DanmakuManager) {
        this.danmakuManager = danmakuManager
    }

    init(canvas) {
        this.canvas = canvas;
    }

    resize(width: number, height: number) {
        this.canvas.width = this.width = width * this.danmakuManager.p;
        this.canvas.height = this.height = height * this.danmakuManager.p;
    }


    update(pause = false) {
        if (!this.danmakuManager.visible || this.danmakuManager.opacity == 0 || pause == true) {
            return
        }
        let layoutManager = this.danmakuManager.layoutManager;
        this.clearAll();
        this.drawList(layoutManager.initialList, layoutManager.initialListRange[0], layoutManager.initialListRange[1]);
        this.drawList(layoutManager.appendList, layoutManager.appendListRange[0], layoutManager.appendListRange[1]);
    }

    drawList(list: Array<DanmakuItem>, start: number, end: number) {

    }

    clearAll() {

    }


    drawItemBuffer(item: DanmakuItem) {

    }
}


export class Canvas2DRender extends Renderer {
    ctx: CanvasRenderingContext2D;

    constructor(manager: DanmakuManager) {
        super(manager);
    }

    init(canvas) {
        super.init(canvas);
        this.ctx = canvas.getContext('2d');
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawList(list: Array<DanmakuItem>, start: number, end: number) {
        let drawSettings = this.danmakuManager.drawSettings;
        let rowHeight = drawSettings.fontSize + drawSettings.rowSpace;
        for (let i = start; i <= end; i++) {
            let item = list[i];
            if (item && item.buffer) {
                this.ctx.drawImage(item.buffer, item.left, item.row * rowHeight * drawSettings.p);
            }
        }
    }

    drawItemBuffer(item: DanmakuItem) {
        let content = item.content, color = item.color,
            fontSize = item.fontSize, fontFamily = this.danmakuManager.drawSettings.fontFamily,
            strokeWidth = this.danmakuManager.drawSettings.strokeWidth,
            p = this.danmakuManager.p;
        item.buffer = document.createElement('canvas');
        let ctx = item.buffer.getContext('2d');
        ctx.font = fontSize * p + 'px ' + fontFamily;
        let measure = ctx.measureText(content);
        item.width = item.buffer.width = measure.width + 2 * p * strokeWidth * 2;
        item.height = item.buffer.height = Math.floor((fontSize * 1.3 + 2 * strokeWidth) * p);
        ctx.lineWidth = strokeWidth * p;
        ctx.font = fontSize * p + 'px ' + fontFamily;
        ctx.fillStyle = color;
        //ctx.strokeText(content, strokeWidth * p, item.height-strokeWidth* p-fontSize*0.3 );
        let bright = Number('0x' + color.substr(1, 2)) + Number('0x' + color.substr(3, 2)) + Number('0x' + color.substr(5, 2));
        ctx.shadowColor = (bright > 500) ? '#000000' : '#FFFFFF';
        ctx.shadowBlur = strokeWidth * p;
        ctx.fillText(content, strokeWidth * p, item.height - strokeWidth * p - fontSize * 0.3);
    }
}

export class WebglRender extends Renderer {
    gl;
    texPosStart: number = 0;
    texPosEnd: number = 0;
    texture: WebGLTexture;
    aspect: number = 1;
    program: WebGLProgram;
    posVBO: WebGLBuffer;
    posAL: number;
    posArray: Float32Array;

    texposVBO: WebGLBuffer;
    texposAL;
    texposArray: Float32Array;


    mvpMatUL;

    textureUL;
    tmpcanvas: HTMLCanvasElement;
    tmpCtx: CanvasRenderingContext2D;

    videoEl;
    videoRender;
    videoProgram;
    videoTex;
    videoTexUL;
    videoReady;
    videoPosAL;
    videoMvpMatUL;
    videoUvAL;
    videoWidth;
    videoHeight;
    videoPosVBO;
    videoUvVBO;
    logoTexture;
    logoTextureUL;


    vrProgram;
    vrPosAL;
    vrIndexUL;
    vrTexUL;
    vrPosVbo;
    vrFBuffers = [];
    vrTextures = [];


    mvpMat = mat4.create();

    modelMat = mat4.create();
    viewMat = mat4.create();
    perspectiveMat = mat4.create();

    eyePosition = new Float32Array([0, 0, 2.5]);
    eyePositionStart = new Float32Array([0, 0]);
    distance = 0.8;
    rotate = new Float32Array([0, 0]);
    center = new Float32Array([0, 0, 0]);
    updir = new Float32Array([0, 1, 0]);
    fov = 30;
    near = 1;
    far = 100;


    mouseDown = false;
    downPosX = 0;
    downPosY = 0;

    constructor(manager: DanmakuManager) {
        super(manager)
    }

    init(canvas: HTMLCanvasElement, maxcount = 400, videoRender = true) {
        super.init(canvas);
        this.gl = canvas.getContext('webgl');
        this.tmpcanvas = document.createElement('canvas');
        this.tmpCtx = this.tmpcanvas.getContext('2d');
        this.texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 4096, 4096, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        let logoImg = document.createElement('img');
        this.logoTexture = this.gl.createTexture();
        logoImg.onload = function () {
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.logoTexture);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, logoImg)
        }.bind(this);
        logoImg.src = 'images/videologo.png';
        let vst = `
                    attribute vec3 pos;
                    attribute float texpos;
                    letying vec2 uvCoord;
                    uniform mat4 mvpMat;
                    void main(){
                        vec4 position=vec4(pos,1.0);
                        position=mvpMat*position;
                        gl_Position=position;
                        uvCoord=vec2(fract(texpos),floor(mod(texpos,128.0))/128.0);
                    }
                `;
        let fst = `
                    precision mediump float;
                    letying vec2 uvCoord;
                    uniform sampler2D texture;
                    void main(){
                        vec4 color=texture2D(texture,uvCoord);
                        gl_FragColor=color;
                    }
                `;
        this.program = getProgramByShaderSource(this.gl, vst, fst);
        this.posArray = new Float32Array(maxcount * 6 * 3);
        this.texposArray = new Float32Array(maxcount * 6 * 2);
        this.posVBO = getVBO(this.gl, this.posArray);
        this.texposVBO = getVBO(this.gl, this.texposArray);
        this.posAL = this.gl.getAttribLocation(this.program, 'pos');
        this.texposAL = this.gl.getAttribLocation(this.program, 'texpos');
        this.textureUL = this.gl.getUniformLocation(this.program, 'texture');
        this.mvpMatUL = this.gl.getUniformLocation(this.program, 'mvpMat');


        this.videoRender = videoRender;
        if (videoRender) {
            //this.danmakuManager.player.videoEl.style.display='none';
            this.canvas.style.background = 'black';
            this.videoEl = this.danmakuManager.player.videoEl;
            let videoVST = `
                        attribute vec3 pos;
                        attribute vec2 uv;
                        uniform mat4 mvpMat;
                        letying vec2 uvCoord;
                        void main(){
                            vec4 position=vec4(pos,1.0);
                            position=mvpMat*position;
                        gl_Position=position;
                        uvCoord=uv;
                        }
                    `;
            let videoFst = `
                    precision mediump float;
                    letying vec2 uvCoord;
                    uniform sampler2D texture;
                    uniform sampler2D logoTexture;
                    void main(){
                       if(gl_FrontFacing)
                    {
                        vec4 color=texture2D(logoTexture,uvCoord);
                        gl_FragColor=color;
                    }else{
                        vec4 color=texture2D(texture,uvCoord);
                        gl_FragColor=color;
                        }
                    }
                    `;
            this.videoProgram = getProgramByShaderSource(this.gl, videoVST, videoFst);
            this.videoPosAL = this.gl.getAttribLocation(this.videoProgram, 'pos');
            this.videoUvAL = this.gl.getAttribLocation(this.videoProgram, 'uv');
            this.videoMvpMatUL = this.gl.getUniformLocation(this.videoProgram, 'mvpMat');
            this.videoTexUL = this.gl.getUniformLocation(this.videoProgram, 'texture');
            this.logoTextureUL = this.gl.getUniformLocation(this.videoProgram, 'logoTexture');

            //vr

            let initFB = (i) => {
                this.vrFBuffers[i] = this.gl.createFramebuffer();
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.vrFBuffers[i]);
                this.vrTextures[i] = this.gl.createTexture();
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.vrTextures[i]);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1024, 1024, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.vrTextures[i], 0)
            };
            initFB(0);
            initFB(1);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);


            this.videoEl.addEventListener('loadedmetadata', function () {
                this.videoTex = this.gl.createTexture();
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.videoTex);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.videoEl.videoWidth, this.videoEl.videoHeight, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
                this.videoHeight = this.videoEl.videoHeight;
                this.videoWidth = this.videoEl.videoWidth;
                let vasp = this.videoEl.videoHeight / this.videoEl.videoWidth;
                this.videoPosVBO = getVBO(this.gl, new Float32Array([-1, vasp, 0, 1, vasp, 0, 1, -vasp, 0, -1, vasp, 0, 1, -vasp, 0, -1, -vasp, 0]));
                this.videoUvVBO = getVBO(this.gl, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]));
                this.videoReady = true;
            }.bind(this));

            this.danmakuManager.player.containerEl.addEventListener('mousedown', function (e) {
                e.stopPropagation();
                this.mouseDown = true;
                this.downPosX = e.screenX;
                this.downPosY = e.screenY;
                vec2.copy(this.eyePositionStart, this.rotate);
            }.bind(this), false);
            window.addEventListener('mousemove', function (e) {
                if (this.mouseDown) {
                    this.rotate[0] = -0.003 * (e.screenX - this.downPosX) + this.eyePositionStart[0];
                    this.rotate[1] = -0.003 * (e.screenY - this.downPosY) + this.eyePositionStart[1];
                }
            }.bind(this), true);
            window.addEventListener('mouseup', function (e) {
                if (this.mouseDown) {
                    this.mouseDown = false;
                }
            }.bind(this), true);
            this.danmakuManager.player.containerEl.addEventListener('mousewheel', function (e) {
                e.preventDefault();
                if ((e.wheelDelta || e.detail) > 0) {
                    this.fov /= 1 + (0.4 * Math.abs((e.wheelDelta / 120 || e.detail / 3)));
                } else {
                    this.fov *= 1 + (0.4 * Math.abs((e.wheelDelta / 120 || e.detail / 3)));
                }
                this.fov = Math.max(10, Math.min(80, this.fov))
            }.bind(this));

        }

        vst = `
                    attribute vec2 pos;
                    uniform float index;
                    letying vec2 uvCoord;
                    void main(){
                        vec2 tempPos=pos;

                        uvCoord=(tempPos+vec2(1.0,1.0))*0.5;

                        if(index==1.0){
                            tempPos.x=tempPos.x*0.5-0.5;
                        }else{
                            tempPos.x=-tempPos.x;
                            tempPos.x=tempPos.x*0.5+0.5;
                            uvCoord.x=1.0-uvCoord.x;
                        }
                        gl_Position=vec4(tempPos,0.0,1.0);
                    }
                `;
        fst = `
                    precision mediump float;
                    letying vec2 uvCoord;
                    uniform sampler2D texture;
                    void main(){
                        gl_FragColor=texture2D(texture,uvCoord);
                    }
                `;
        this.vrProgram = getProgramByShaderSource(this.gl, vst, fst);
        this.vrPosAL = this.gl.getAttribLocation(this.vrProgram, 'pos');
        this.vrIndexUL = this.gl.getUniformLocation(this.vrProgram, 'index');
        this.vrTexUL = this.gl.getUniformLocation(this.vrProgram, 'texture');

    }


    __enableVR = false;

    get enableVR() {
        return this.__enableVR
    }

    set enableVR(v) {
        if (v == true) {
            this.initVR();
        }
        this.__enableVR = v
    }

    vrDev;
    vrEyeParams = [];

    initVR() {
        window['test'] = this;
        if (!this.vrDev) {
            navigator['getVRDisplays']().then(result => {
                this.vrDev = result[0];
                this.vrEyeParams[0] = this.vrDev.getEyeParameters('left');
                this.vrEyeParams[1] = this.vrDev.getEyeParameters('right');
                let fov = this.vrEyeParams[0].fieldOfView;
                let x1 = -fov.rightDegrees / fov.leftDegrees;
                let x2 = 1;
                let y1 = fov.downDegrees / fov.upDegrees;
                let y2 = -1;
                this.vrPosVbo = getVBO(this.gl, [x1, y1, x2, y1, x2, y2, x1, y1, x2, y2, x1, y2]);
                this.vrPosVbo = getVBO(this.gl, [-1, 1, 1, 1, 1, -1, -1, 1, 1, -1, -1, -1]);
            });
        }
    }


    btnupdown = false;
    btndowndown = false;
    btnleftdown = false;
    btnrightdown = false;

    updatePos() {
        let direction = new Float32Array([0, 0, 0.01]);
        let length = vec3.len(direction);
        vec3.rotateY(direction, direction, this.center, this.rotate[0]);
        vec3.rotateX(direction, direction, this.center, this.rotate[1]);
        if (this.btnupdown) {
            vec3.sub(this.eyePosition, this.eyePosition, direction)
        }
        if (this.btndowndown) {
            vec3.add(this.eyePosition, this.eyePosition, direction)
        }
        if (this.btnleftdown) {
            vec3.add(this.eyePosition, this.eyePosition, [length * -Math.cos(this.rotate[0]), 0, length * Math.sin(this.rotate[1])]);
        }
        if (this.btnrightdown) {
            vec3.sub(this.eyePosition, this.eyePosition, [length * -Math.cos(this.rotate[0]), 0, length * Math.sin(this.rotate[1])])
        }
    }


    resize(width: number, height: number) {
        super.resize(width, height);

        this.gl.viewport(0, 0, this.width, this.height);
        this.width = width;
        this.height = height;
        this.aspect = this.width / this.height
    }

    updateMvp() {
        //let epos=new Float32Array([this.distance*Math.cos(this.eyePosition[0]),0,this.distance*Math.sin(this.eyePosition[0])]);


        mat4.lookAt(this.viewMat, this.eyePosition, this.center, this.updir);
        mat4.perspective(this.perspectiveMat, this.fov * 3.14159 / 180, this.aspect, this.near, this.far);
        mat4.identity(this.modelMat);
        mat4.rotateY(this.modelMat, this.modelMat, this.rotate[0]);
        mat4.rotateX(this.modelMat, this.modelMat, this.rotate[1]);
        //mat4.translate(this.viewMat, this.viewMat, [-this.eyePosition[0], -this.eyePosition[1], -this.eyePosition[2]]);
        mat4.multiply(this.mvpMat, this.perspectiveMat, this.viewMat);
        mat4.multiply(this.mvpMat, this.mvpMat, this.modelMat);
    }

    updateVrMVP(index) {
        let ePos = vec3.create();
        vec3.subtract(ePos, ePos, this.vrEyeParams[index].offset);
        let vmat = mat4.create();
        mat4.translate(vmat, vmat, ePos);
        let rotate = mat4.create();
        mat4.fromQuat(rotate, this.vrDev.getPose().orientation);
        //ma44.rotateY(rotate,rotate,0.5*3.1415926);
        mat4.mul(vmat, rotate, vmat);
        mat4.invert(vmat, vmat);
        let fov = 80;
        mat4.perspective(this.perspectiveMat, fov * 3.14159 / 180, 1, 0.04, 100);
        mat4.multiply(this.mvpMat, this.perspectiveMat, vmat);
        let modelMat = mat4.create();
        mat4.translate(modelMat, modelMat, [-1, 0, 0]);
        mat4.rotateY(modelMat, modelMat, 0.5 * 3.1415926);
        mat4.scale(modelMat, modelMat, vec3.fromValues(0.7, 0.7, 0.7));
        mat4.multiply(this.mvpMat, this.mvpMat, modelMat);
    }

    bindVR(index) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.vrFBuffers[index]);
        //let width=this.vrEyeParams[0].fieldOfView.
        this.gl.viewport(0, 0, 1024, 1024);
        this.updateVrMVP(index);
    }

    renderVideo() {
        //this.gl.useProgram(this.videoProgram);
        this.gl.uniformMatrix4fv(this.videoMvpMatUL, false, this.mvpMat);
        this.gl.depthMask(true);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    renderDanmaku() {
        this.gl.uniformMatrix4fv(this.mvpMatUL, false, this.mvpMat);
        this.gl.depthMask(false);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.drawCount * 6);
    }

    renderVR() {
        this.gl.useProgram(this.vrProgram);
        this.gl.viewport(0, 0, this.width * this.danmakuManager.p, this.height * this.danmakuManager.p);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vrPosVbo);
        this.gl.enableVertexAttribArray(this.vrPosAL);
        this.gl.vertexAttribPointer(this.vrPosVbo, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform1i(this.vrTexUL, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.vrTextures[0]);
        this.gl.uniform1f(this.vrIndexUL, 0.0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.vrTextures[1]);
        this.gl.uniform1f(this.vrIndexUL, 1.0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    update() {
        if (!this.enableVR) {
            this.updateMvp();
        }
        //this.updateMvp();
        if (this.videoReady) {
            this.gl.useProgram(this.videoProgram);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.depthMask(true);
            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.disable(this.gl.BLEND);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.videoTex);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.videoEl);
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.logoTexture);
            this.gl.uniform1i(this.logoTextureUL, 1);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.videoPosVBO);
            this.gl.enableVertexAttribArray(this.videoPosAL);
            this.gl.vertexAttribPointer(this.videoPosAL, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.videoUvVBO);
            this.gl.enableVertexAttribArray(this.videoUvAL);
            this.gl.vertexAttribPointer(this.videoUvAL, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.uniform1i(this.videoTexUL, 0);

            //this.gl.uniformMatrix4fv(this.videoMvpMatUL, false, this.mvpMat);
            //this.gl.depthMask(true);
            //this.gl.enable(this.gl.DEPTH_TEST);
            //this.gl.depthFunc(this.gl.LEQUAL);
            //this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
            //this.updateVrMVP(0);
            //this.updateMvp();
            //this.renderVideo();
            if (this.enableVR && this.vrDev) {
                this.bindVR(0);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                this.renderVideo();
                this.bindVR(1);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                this.renderVideo();
            } else {
                this.renderVideo()
            }
        }


        if (!this.danmakuManager.visible || this.danmakuManager.opacity == 0) {
            return
        }
        let layoutManager = this.danmakuManager.layoutManager;
        this.activeTexture();
        this.texPosStart = Number.MAX_VALUE;

        let list = layoutManager.initialList.slice(layoutManager.initialListRange[0], layoutManager.initialListRange[1]).concat(layoutManager.appendList.slice(layoutManager.appendListRange[0], layoutManager.appendListRange[1]));
        if (this.videoReady) {
            list.sort(function (a, b) {
                return a.zpos - b.zpos
            })
        }
        //this.drawList(layoutManager.initialList,layoutManager.initialListRange[0],layoutManager.initialListRange[1]);
        //this.drawList(layoutManager.appendList,layoutManager.appendListRange[0],layoutManager.appendListRange[1]);
        this.drawList(list);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.posArray, this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(this.posAL);
        this.gl.vertexAttribPointer(this.posAL, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texposVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.texposArray, this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(this.texposAL);
        this.gl.vertexAttribPointer(this.texposAL, 1, this.gl.FLOAT, false, 0, 0);
        if (this.enableVR && this.vrDev) {
            this.bindVR(0);
            this.renderDanmaku();
            this.bindVR(1);
            this.renderDanmaku();
            this.renderVR();
        } else {
            this.renderDanmaku()
        }
        //this.gl.uniformMatrix4fv(this.mvpMatUL, false, this.mvpMat);
        //this.gl.depthMask(false);
        //this.gl.drawArrays(this.gl.TRIANGLES, 0, this.drawCount * 6);
        this.drawCount = 0;
        this.textureIsActive = false;
    }

    textureIsActive = false;

    activeTexture() {
        if (!this.textureIsActive) {
            this.gl.useProgram(this.program);
            this.gl.enable(this.gl.BLEND);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.uniform1i(this.textureUL, 0);
        }
    }

    drawItemBuffer(item: DanmakuItem) {
        if (this.texPosStart - this.texPosEnd > 127) {
            return
        }
        this.activeTexture();
        let content = item.content, color = item.color,
            fontSize = item.fontSize, fontFamily = this.danmakuManager.drawSettings.fontFamily,
            strokeWidth = this.danmakuManager.drawSettings.strokeWidth,
            p = this.danmakuManager.p;
        let ctx = this.tmpCtx;
        ctx.font = 25 + 'px ' + fontFamily;
        let measure = ctx.measureText(content);
        item.width = this.tmpcanvas.width = measure.width + 2 * strokeWidth * 2 + 10;

        let relWidth = item.width / 4096;
        item.width *= p;
        if (relWidth >= 1) {
            return
        }
        item.height = 32;
        this.tmpcanvas.height = 32;
        ctx.lineWidth = strokeWidth;
        ctx.font = 25 + 'px ' + fontFamily;
        ctx.fillStyle = color;
        //ctx.strokeText(content, strokeWidth * p, item.height-strokeWidth* p-fontSize*0.3 );
        let bright = Number('0x' + color.substr(1, 2)) + Number('0x' + color.substr(3, 2)) + Number('0x' + color.substr(5, 2));
        ctx.shadowColor = (bright > 500) ? '#000000' : '#FFFFFF';
        ctx.shadowBlur = strokeWidth;
        ctx.clearRect(0, 0, this.tmpcanvas.width, this.tmpcanvas.height);
        ctx.fillText(content, strokeWidth + 3, item.height - strokeWidth - fontSize * 0.3 + 1);

        let x = this.texPosEnd % 1;

        let y = Math.floor(this.texPosEnd % 128);

        if (relWidth + x <= 1) {
            this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, Math.floor(x * 4096), y * 32, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.tmpcanvas);
            item.texposStart = this.texPosEnd;
            this.texPosEnd += relWidth;
            item.texposEnd = this.texPosEnd;
        } else {
            y = y + 1;
            x = 0;
            this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, Math.floor(x * 4096), y * 32, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.tmpcanvas);
            item.texposStart = Math.ceil(this.texPosEnd);
            item.texposEnd = this.texPosEnd = item.texposStart + relWidth;
            //let firstHalf=this.tmpCtx.getImageData(0,0,Math.round((1-x)*4096),32);
            //let secondHalf=this.tmpCtx.getImageData(Math.round((relWidth-1+x)*4096),0,Math.round(relWidth*4096),32);
            //this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,x*4096,y*32,this.gl.RGBA,this.gl.UNSIGNED_BYTE,firstHalf);
            //this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,0,(y+1)*32,this.gl.RGBA,this.gl.UNSIGNED_BYTE,secondHalf)
        }

        item.buffer = true;
        item.zpos = this.__enableVR ? 2 * Math.random() : Math.random()
    }

    drawList(list: Array<DanmakuItem>) {
        let posList = this.posArray;
        let uvList = this.texposArray;
        let w = this.width, h = this.height;
        let drawSettings = this.danmakuManager.drawSettings;
        let rowHeight = drawSettings.fontSize + drawSettings.rowSpace;
        let a = this.aspect;
        let va = this.videoWidth / this.videoHeight;
        let vh = w / va;
        let p = drawSettings.p;
        for (let i = 0; i <= list.length; i++) {
            let item = list[i];
            if (!item) {
                continue
            }
            let index = this.drawCount * 18;
            posList[index] = (item.left / p / w * 2 - 1);
            posList[index + 1] = (1 / va - ((item.row + 0.5) * rowHeight / 2) / vh * 2.5);

            posList[index + 3] = ((item.left / p + item.width / p) / w * 2 - 1);
            posList[index + 4] = posList[index + 1];

            posList[index + 6] = posList[index + 3];
            posList[index + 7] = posList[index + 1] + item.height / vh * 1.15;

            posList[index + 9] = posList[index];
            posList[index + 10] = posList[index + 1];

            posList[index + 12] = posList[index + 6];
            posList[index + 13] = posList[index + 7];

            posList[index + 15] = posList[index];
            posList[index + 16] = posList[index + 7];

            posList[index + 2] = posList[index + 5] = posList[index + 8] = posList[index + 11] = posList[index + 14] = posList[index + 17] = 0.5 * item.zpos;
            index = this.drawCount * 6;
            uvList[index] = item.texposStart + 1 + 3 / 4096;
            uvList[index + 1] = item.texposEnd + 1 - 3 / 4096;
            uvList[index + 2] = item.texposEnd - 3 / 4096;
            uvList[index + 3] = uvList[index];
            uvList[index + 4] = uvList[index + 2];
            uvList[index + 5] = item.texposStart + 3 / 4096;
            this.drawCount++;
            this.texPosStart = Math.min(item.texposStart, this.texPosStart);
        }

    }

    drawCount = 0;

}
