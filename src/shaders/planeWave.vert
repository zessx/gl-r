precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform vec2 uMouse;

void main(void) {
    vPos = aPos;
    vUvs = aUvs;

    vec3 pos = aPos;
    vec2 uvs = vUvs;

    // Side left -> right
    // pos.z += sin((uTime + aUvs.x) * 5.);

    // Side center -> sides
    vec2 c = vUvs;
    c -= vec2(.5);
    c -= uMouse / 2.;
    float dist = sqrt(dot(c, c));
    // pos.z = sin((uTime + dist * 2.) * 5.) * (1.0 - dist) * 0.3;
    pos.z = sin((uTime + dist * 2.) * 5.) * 0.3;
    // pos.z = sin((uTime + uvs.x) * 5.) * 0.3;

    // Mouse shift
    // vec2 c = vUvs;
    // c -= vec2(.5);
    // c -= uMouse / -2.;
    // float dist = sqrt(dot(c, c));
    // // // pos.z = sin((uTime + dist * 2.) * 5.) * (1.0 - dist) * 0.3;
    // // pos = vec3(c, dist * 5.);
    // pos.z = dist * -5.;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
}