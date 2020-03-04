precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;

uniform float uTime;

void main(void) {
    vPos = aPos;
    vUvs = aUvs;

    vPos *= vec3(0.6);

    gl_Position = vec4(vPos, 1.0);
}