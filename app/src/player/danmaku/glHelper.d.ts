declare function getShaderText(id: any): string;
declare function getProgram(ctx: any, vShader: any, fShader: any): any;
declare function getProgramByShaderSource(ctx: any, vShader: any, fShader: any): any;
declare function getShader(ctx: any, isVshader: any, shaderText: any): any;
declare function getVBO(ctx: any, data: any): any;
declare function bindAttribute(ctx: any, attrLocation: any, attrSize: any, vbo: any): void;
declare function getTextureByImgObject(webgl: any, imgObj: any, texindex: any): any;
declare function create_ibo(gl: any, data: any): any;
declare function uniformController(glCtx: any, glProgram: any, uniformData: any): {
    bindUniform: (name: any, value: any) => void;
};
declare function clone(myObj: any): any;
declare function getUid(): number;
declare function getIBO(gl: any, data: any): any;
declare function resizeGlTextureImg(imgobj: any, size?: any): any;
declare function supportWebGL(): boolean;
