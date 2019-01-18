precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

// uniform mat4 uMMatrix;
// uniform mat4 uVMatrix;
// uniform mat4 uPMatrix;
uniform mat4 uMVPMatrix;

uniform float uTime;
uniform float uMix;
uniform float uHeight;
uniform vec2  uPlaneScale;

uniform sampler2D uTexture;


varying vec2 vUv;

void main(void) {
    vUv = aUvs;

    vec3 pos = aPos;
    vec2 u = (vec2(vUv) -.5) * 2.;
    u.x *= uPlaneScale.x/uPlaneScale.y;
    float r = sqrt(dot(u, u)) * .1;
    vec2 uv = vUv;
    uv *= .05;
    uv -= r - (uTime * .3);
    float disp = texture2D(uTexture, uv).r;
    pos.z += disp * .3;

    gl_Position = mix(vec4(pos, 1.0), uMVPMatrix * vec4(pos, 1.0), uMix);
}