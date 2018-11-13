/**
 * Created by yjh on 15/3/15.
 */
function getShaderText(id){
    return document.getElementById(id).innerHTML;
}

function getProgram(ctx,vShader,fShader){
    let programObj=ctx.createProgram();
    ctx.attachShader(programObj,vShader);
    ctx.attachShader(programObj,fShader);
    ctx.linkProgram(programObj);
    if(ctx.getProgramParameter(programObj,ctx.LINK_STATUS)){
        ctx.useProgram(programObj);
        return programObj
    }else{
        console.log(ctx.getProgramInfoLog(programObj))
    }
}
function getProgramByShaderSource(ctx,vShader,fShader){
   let vs=getShader(ctx,true,vShader);
    let fs=getShader(ctx,false,fShader);
    return getProgram(ctx,vs,fs)
}

function getShader(ctx,isVshader,shaderText){
    let newshader=isVshader?ctx.createShader(ctx.VERTEX_SHADER):ctx.createShader(ctx.FRAGMENT_SHADER);
    ctx.shaderSource(newshader,shaderText);
    ctx.compileShader(newshader);
    if(ctx.getShaderParameter(newshader,ctx.COMPILE_STATUS)){
        return newshader;
    }else{
        console.log(ctx.getShaderInfoLog(newshader));
    }
}
function getVBO(ctx,data){
    let vbo=ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER,vbo);
    ctx.bufferData(ctx.ARRAY_BUFFER,new Float32Array(data),ctx.STATIC_DRAW);
    ctx.bindBuffer(ctx.ARRAY_BUFFER,null);
    return vbo;
}
function bindAttribute(ctx,attrLocation,attrSize,vbo){
    ctx.bindBuffer(ctx.ARRAY_BUFFER,vbo);
    ctx.enableVertexAttribArray(attrLocation);
    ctx.vertexAttribPointer(attrLocation,attrSize,ctx.FLOAT,false,0,0);
}
function getTextureByImgObject(webgl,imgObj,texindex){

    webgl.activeTexture(webgl.TEXTURE0+texindex);


    let textureObject = webgl.createTexture();
    webgl.bindTexture(webgl.TEXTURE_2D, textureObject);
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, imgObj);
    webgl.generateMipmap(webgl.TEXTURE_2D);

    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
   // webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
   // webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
   // webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
   // webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

    return textureObject;
}
function create_ibo(gl,data){
    // 生成缓存对象
    let ibo = gl.createBuffer();

    // 绑定缓存
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // 向缓存中写入数据
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

    // 将缓存的绑定无效化
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // 返回生成的IBO
    return ibo;
}

function uniformController(glCtx,glProgram,uniformData){
    let program=glProgram;
    let data=uniformData;
    for(let i in uniformData){
        let item=uniformData[i];
        item.location=glCtx.getUniformLocation(program,i);
    }
    return{
        bindUniform:function(name,value){
            let item=data[name];
            let type=item.type;
            if (type=="Matrix3fv"||type=="Matrix4fv"){
                glCtx["uniform"+type](item.location,false,value);
            }else{
                glCtx["uniform"+type](item.location,value);
            }
        }
    }

}
function clone(myObj){
    if(typeof(myObj) != 'object' || myObj == null) return myObj;
    let newObj = {};
    for(let i in myObj){
        newObj[i] = clone(myObj[i]);
    }
    return newObj;
}
function  getUid(){
    return Date.now()%10000+Math.random();
}
function getIBO(gl,data){
    // 生成缓存对象
    let ibo = gl.createBuffer();

    // 绑定缓存
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // 向缓存中写入数据
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

    // 将缓存的绑定无效化
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // 返回生成的IBO
    return ibo;
}

function resizeGlTextureImg(imgobj,size=null){
    let w=imgobj.width;
    let h=imgobj.height;
    let log2=Math['log2']|| function (value) {
          return Math.log(value)/Math.log(2)
        };
    if(!size){
        if(w==h&&(log2(w)%1==0)){
            return imgobj
        }else{
            let canvas=document.createElement('canvas');
            canvas.width=canvas.height=size?size:Math.pow(2,Math.ceil(log2(Math.max(w,h))));
            let ctx=canvas.getContext('2d');
            ctx.drawImage(imgobj,0,0,imgobj.width,imgobj.height,0,0,canvas.width,canvas.height);
            return canvas
        }
    }
}
function supportWebGL(){
    return !!document.createElement('canvas').getContext('webgl');

}