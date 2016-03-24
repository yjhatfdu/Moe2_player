
// Type definitions for gl-matrix 2.3.1
// Project: http://glmatrix.net/
// Definitions by: chuntaro <https://github.com/chuntaro/>
// Definitions: https://github.com/chuntaro/gl-matrix.d.ts


interface glMatrix {
	EPSILON: number;
	ARRAY_TYPE: Float32Array | Array<number>;
	RANDOM: () => number;
	setMatrixArrayType<T>(type: T): void;
	toRadian(a: number): number;
}
declare var glMatrix: glMatrix;


interface vec2 {
	create(): Float32Array;
	clone(a: Float32Array): Float32Array;
	fromValues(x: number, y: number): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	set(out: Float32Array, x: number, y: number): Float32Array;
	add(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	subtract(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	sub(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	divide(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	div(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	min(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	max(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	scale(out: Float32Array, a: Float32Array, b: number): Float32Array;
	scaleAndAdd(out: Float32Array, a: Float32Array, b: Float32Array, scale: number): Float32Array;
	distance(a: Float32Array, b: Float32Array): number;
	dist(a: Float32Array, b: Float32Array): number;
	squaredDistance(a: Float32Array, b: Float32Array): number;
	sqrDist(a: Float32Array, b: Float32Array): number;
	length(a: Float32Array): number;
	len(a: Float32Array): number;
	squaredLength(a: Float32Array): number;
	sqrLen(a: Float32Array): number;
	negate(out: Float32Array, a: Float32Array): Float32Array;
	inverse(out: Float32Array, a: Float32Array): Float32Array;
	normalize(out: Float32Array, a: Float32Array): Float32Array;
	dot(a: Float32Array, b: Float32Array): number;
	cross(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	lerp(out: Float32Array, a: Float32Array, b: Float32Array, t: number): Float32Array;
	random(out: Float32Array, scale: number): Float32Array;
	transformMat2(out: Float32Array, a: Float32Array, m: Float32Array): Float32Array;
	transformMat2d(out: Float32Array, a: Float32Array, m: Float32Array): Float32Array;
	transformMat3(out: Float32Array, a: Float32Array, m: Float32Array): Float32Array;
	transformMat4(out: Float32Array, a: Float32Array, m: Float32Array): Float32Array;
	forEach<T>(a: Float32Array[], stride: number, offset: number, count: number, fn: (a: Float32Array, b: Float32Array, arg: T) => void, arg: T): Float32Array[];
	str(a: Float32Array): string;
}
declare var vec2: vec2;


interface vec3 {
	create(): Float32Array;
	clone(a: Float32Array): Float32Array;
	fromValues(x: number, y: number, z: number): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	set(out: Float32Array, x: number, y: number, z: number): Float32Array;
	add(out: Float32Array, a: Float32Array, b: any): Float32Array;
	subtract(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	sub(out: Float32Array, a: Float32Array, b: any): Float32Array;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	divide(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	div(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	min(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	max(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	scale(out: Float32Array, a: Float32Array, b: number): Float32Array;
	scaleAndAdd(out: Float32Array, a: Float32Array, b: Float32Array, scale: number): Float32Array;
	distance(a: Float32Array, b: Float32Array): number;
	dist(a: Float32Array, b: Float32Array): number;
	squaredDistance(a: Float32Array, b: Float32Array): number;
	sqrDist(a: Float32Array, b: Float32Array): number;
	length(a: Float32Array): number;
	len(a: Float32Array): number;
	squaredLength(a: Float32Array): number;
	sqrLen(a: Float32Array): number;
	negate(out: Float32Array, a: Float32Array): Float32Array;
	inverse(out: Float32Array, a: Float32Array): Float32Array;
	normalize(out: Float32Array, a: Float32Array): Float32Array;
	dot(a: Float32Array, b: Float32Array): number;
	cross(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	lerp(out: Float32Array, a: Float32Array, b: Float32Array, t: number): Float32Array;
	hermite(out: Float32Array, a: Float32Array, b: Float32Array, c: Float32Array, d: Float32Array, t: number): Float32Array;
	bezier(out: Float32Array, a: Float32Array, b: Float32Array, c: Float32Array, d: Float32Array, t: number): Float32Array;
	random(out: Float32Array, scale: number): Float32Array;
	transformMat4(out: Float32Array, a: Float32Array, m: Float32Array): Float32Array;
	transformMat3(out: Float32Array, a: Float32Array, m: Float32Array): Float32Array;
	transformQuat(out: Float32Array, a: Float32Array, q: Float32Array): Float32Array;
	rotateX(out: Float32Array, a: Float32Array, b: Float32Array, c: number): Float32Array;
	rotateY(out: Float32Array, a: Float32Array, b: Float32Array, c: number): Float32Array;
	rotateZ(out: Float32Array, a: Float32Array, b: Float32Array, c: number): Float32Array;
	forEach<T>(a: Float32Array[], stride: number, offset: number, count: number, fn: (a: Float32Array, b: Float32Array, arg: T) => void, arg: T): Float32Array[];
	angle(a: Float32Array, b: Float32Array): number;
	str(a: Float32Array): string;
}
declare var vec3: vec3;


interface vec4 {
	create(): Float32Array;
	clone(a: Float32Array): Float32Array;
	fromValues(x: number, y: number, z: number, w: number): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	set(out: Float32Array, x: number, y: number, z: number, w: number): Float32Array;
	add(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	subtract(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	sub(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	divide(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	div(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	min(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	max(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	scale(out: Float32Array, a: Float32Array, b: number): Float32Array;
	scaleAndAdd(out: Float32Array, a: Float32Array, b: Float32Array, scale: number): Float32Array;
	distance(a: Float32Array, b: Float32Array): number;
	dist(a: Float32Array, b: Float32Array): number;
	squaredDistance(a: Float32Array, b: Float32Array): number;
	sqrDist(a: Float32Array, b: Float32Array): number;
	length(a: Float32Array): number;
	len(a: Float32Array): number;
	squaredLength(a: Float32Array): number;
	sqrLen(a: Float32Array): number;
	negate(out: Float32Array, a: Float32Array): Float32Array;
	inverse(out: Float32Array, a: Float32Array): Float32Array;
	normalize(out: Float32Array, a: Float32Array): Float32Array;
	dot(a: Float32Array, b: Float32Array): number;
	lerp(out: Float32Array, a: Float32Array, b: Float32Array, t: number): Float32Array;
	random(out: Float32Array, scale: number): Float32Array;
	transformMat4(out: Float32Array, a: Float32Array, m: Float32Array): Float32Array;
	transformQuat(out: Float32Array, a: Float32Array, q: Float32Array): Float32Array;
	forEach<T>(a: Float32Array[], stride: number, offset: number, count: number, fn: (a: Float32Array, b: Float32Array, arg: T) => void, arg: T): Float32Array[];
	str(a: Float32Array): string;
}
declare var vec4: vec4;


interface mat2 {
	create(): Float32Array;
	clone(a: Float32Array): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	identity(out: Float32Array): Float32Array;
	transpose(out: Float32Array, a: Float32Array): Float32Array;
	invert(out: Float32Array, a: Float32Array): Float32Array;
	adjoint(out: Float32Array, a: Float32Array): Float32Array;
	determinant(a: Float32Array): number;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	rotate(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	scale(out: Float32Array, a: Float32Array, v: Float32Array): Float32Array;
	fromRotation(out: Float32Array, rad: number): Float32Array;
	fromScaling(out: Float32Array, v: Float32Array): Float32Array;
	str(a: Float32Array): string;
	frob(a: Float32Array): number;
	LDU(L: Float32Array, D: Float32Array, U: Float32Array, a: Float32Array): Float32Array[];
}
declare var mat2: mat2;


interface mat2d {
	create(): Float32Array;
	clone(a: Float32Array): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	identity(out: Float32Array): Float32Array;
	invert(out: Float32Array, a: Float32Array): Float32Array;
	determinant(a: Float32Array): number;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	rotate(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	scale(out: Float32Array, a: Float32Array, v: Float32Array): Float32Array;
	translate(out: Float32Array, a: Float32Array, v: Float32Array): Float32Array;
	fromRotation(out: Float32Array, rad: number): Float32Array;
	fromScaling(out: Float32Array, v: Float32Array): Float32Array;
	fromTranslation(out: Float32Array, v: Float32Array): Float32Array;
	str(a: Float32Array): string;
	frob(a: Float32Array): number;
}
declare var mat2d: mat2d;


interface mat3 {
	create(): Float32Array;
	fromMat4(out: Float32Array, a: Float32Array): Float32Array;
	clone(a: Float32Array): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	identity(out: Float32Array): Float32Array;
	transpose(out: Float32Array, a: Float32Array): Float32Array;
	invert(out: Float32Array, a: Float32Array): Float32Array;
	adjoint(out: Float32Array, a: Float32Array): Float32Array;
	determinant(a: Float32Array): number;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	translate(out: Float32Array, a: Float32Array, v: Float32Array): Float32Array;
	rotate(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	scale(out: Float32Array, a: Float32Array, v: Float32Array): Float32Array;
	fromTranslation(out: Float32Array, v: Float32Array): Float32Array;
	fromRotation(out: Float32Array, rad: number): Float32Array;
	fromScaling(out: Float32Array, v: Float32Array): Float32Array;
	fromMat2d(out: Float32Array, a: Float32Array): Float32Array;
	fromQuat(out: Float32Array, q: Float32Array): Float32Array;
	normalFromMat4(out: Float32Array, a: Float32Array): Float32Array;
	str(a: Float32Array): string;
	frob(a: Float32Array): number;
}
declare var mat3: mat3;


interface mat4 {
	create(): Float32Array;
	clone(a: Float32Array): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	identity(out: Float32Array): Float32Array;
	transpose(out: Float32Array, a: Float32Array): Float32Array;
	invert(out: Float32Array, a: Float32Array): Float32Array;
	adjoint(out: Float32Array, a: Float32Array): Float32Array;
	determinant(a: Float32Array): number;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	translate(out: Float32Array, a: Float32Array, v: any): Float32Array;
	scale(out: Float32Array, a: Float32Array, v: Float32Array): Float32Array;
	rotate(out: Float32Array, a: Float32Array, rad: number, axis: Float32Array): Float32Array;
	rotateX(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	rotateY(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	rotateZ(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	fromTranslation(out: Float32Array, v: Float32Array): Float32Array;
	fromScaling(out: Float32Array, v: Float32Array): Float32Array;
	fromRotation(out: Float32Array, rad: number, axis: Float32Array): Float32Array;
	fromXRotation(out: Float32Array, rad: number): Float32Array;
	fromYRotation(out: Float32Array, rad: number): Float32Array;
	fromZRotation(out: Float32Array, rad: number): Float32Array;
	fromRotationTranslation(out: Float32Array, q: Float32Array, v: Float32Array): Float32Array;
	fromRotationTranslationScale(out: Float32Array, q: Float32Array, v: Float32Array, s: Float32Array): Float32Array;
	fromRotationTranslationScaleOrigin(out: Float32Array, q: Float32Array, v: Float32Array, s: Float32Array, o: Float32Array): Float32Array;
	fromQuat(out: Float32Array, q: Float32Array): Float32Array;
	frustum(out: Float32Array, left: number, right: number, bottom: number, top: number, near: number, far: number): Float32Array;
	perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number): Float32Array;
	perspectiveFromFieldOfView(out: Float32Array, fov: number, near: number, far: number): Float32Array;
	ortho(out: Float32Array, left: number, right: number, bottom: number, top: number, near: number, far: number): Float32Array;
	lookAt(out: Float32Array, eye: Float32Array, center: Float32Array, up: Float32Array): Float32Array;
	str(a: Float32Array): string;
	frob(a: Float32Array): number;
}
declare var mat4: mat4;


interface quat {
	create(): Float32Array;
	rotationTo(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	setAxes(out: Float32Array, view: Float32Array, right: Float32Array, up: Float32Array): Float32Array;
	clone(a: Float32Array): Float32Array;
	fromValues(x: number, y: number, z: number, w: number): Float32Array;
	copy(out: Float32Array, a: Float32Array): Float32Array;
	set(out: Float32Array, x: number, y: number, z: number, w: number): Float32Array;
	identity(out: Float32Array): Float32Array;
	setAxisAngle(out: Float32Array, axis: Float32Array, rad: number): Float32Array;
	add(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	mul(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array;
	scale(out: Float32Array, a: Float32Array, b: number): Float32Array;
	rotateX(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	rotateY(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	rotateZ(out: Float32Array, a: Float32Array, rad: number): Float32Array;
	calculateW(out: Float32Array, a: Float32Array): Float32Array;
	dot(a: Float32Array, b: Float32Array): number;
	lerp(out: Float32Array, a: Float32Array, b: Float32Array, t: number): Float32Array;
	slerp(out: Float32Array, a: Float32Array, b: Float32Array, t: number): Float32Array;
	sqlerp(out: Float32Array, a: Float32Array, b: Float32Array, c: Float32Array, d: Float32Array, t: number): Float32Array;
	invert(out: Float32Array, a: Float32Array): Float32Array;
	conjugate(out: Float32Array, a: Float32Array): Float32Array;
	length(a: Float32Array): number;
	len(a: Float32Array): number;
	squaredLength(a: Float32Array): number;
	sqrLen(a: Float32Array): number;
	normalize(out: Float32Array, a: Float32Array): Float32Array;
	fromMat3(out: Float32Array, m: Float32Array): Float32Array;
	str(a: Float32Array): string;
}
declare var quat: quat;

