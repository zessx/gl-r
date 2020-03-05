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

    vPos.x -= 0.08;
    vPos += vec3(0.02, -0.02, 0);
    vPos.x -= (ceil(cos(uTime * 3.) * cos(uTime * 5.) * cos(uTime * 7.) * cos(uTime * 11.) * cos(uTime * 13.)) - 0.5) / 7.;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(vPos, 1.0);
}
