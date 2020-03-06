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

    vPos *= vec3(1.3);

    vPos.x -= 0.08;
    vPos.x -= (ceil(sin(uTime * 3.) * sin(uTime * 5.) * sin(uTime * 7.) * sin(uTime * 11.) * sin(uTime * 13.)) - 0.5) / 7.;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(vPos, 1.0);
}
