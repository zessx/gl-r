precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main(void) {
    vPos = aPos;
    vUvs = aUvs;

    vPos *= vec3(1.3);

    vPos.x -= 0.08;
//    vPos.x += ((random(vec2(uTime)) - vec2(0.5)) * vec2(0.1)).y;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(vPos, 1.0);
}
