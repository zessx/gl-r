precision mediump float;

attribute vec3 aPos;
attribute vec2 aUvs;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec2 vUv;

void main(void) {
    vUv = aUvs;
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPos, 1.0);
}