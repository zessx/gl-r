precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

void main(void) {
    vPos = aPos;
    vUvs = aUvs;

    vec3 pos = vPos;
    vec2 uvs = vUvs;

    pos.z = pos.y * 13.;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
}
