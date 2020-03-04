precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;

uniform float uTime;

void main(void) {
    vPos = aPos;
    vUvs = aUvs;

    vPos.x += sin((uTime + aUvs.y) * 1.3) * 0.1;
    vPos.y += cos((uTime + aUvs.y) * 1.3) * 0.1;

    gl_Position = vec4(vPos, 1.0);
}