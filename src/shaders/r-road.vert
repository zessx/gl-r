precision highp float;

attribute vec3 aPos;
attribute vec2 aUvs;

varying vec3 vPos;
varying vec2 vUvs;
varying float vPerspective;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

void main(void) {
    vPos = aPos;
    vUvs = aUvs;
    vPerspective = 300.;

    vec3 pos = vPos;
    vec2 uvs = vUvs;

    // Rotate the field to create a "road"
    pos.z = pos.y * vPerspective;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
}