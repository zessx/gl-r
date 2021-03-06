precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;

void main(void) {
    vPos = aPos;
    vUvs = aUvs;
    gl_Position = vec4(aPos, 1.0);
}