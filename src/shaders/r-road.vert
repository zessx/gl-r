precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;
varying float vRotation;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

void main(void) {
    vPos = aPos;
    vUvs = aUvs;
    vRotation = 80.;

    vec3 pos = vPos;
    vec2 uvs = vUvs;

    // Rotate the field to create a "road"
    // pos.y *= cos(vRotation);
    // pos.z = sin(vRotation) * pos.y;

    pos.z = pos.y * 13.;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
}