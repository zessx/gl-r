precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec2 vUv;

void main(void) {
    vUv = aUvs;
    gl_Position = vec4(aPos, 1.0);
}