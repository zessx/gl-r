precision highp float;

varying vec3 vPos;
varying vec2 vUvs;

uniform vec2 uRez;
uniform float uTime;

/**
 * R = RETRO
 *
 * https://www.shadertoy.com/view/4dXBW2
 */

void main() {

    vec2 uvs = vUvs ;

    uvs *= vec2(-0.5); // Revert uvs
    uvs += vec2(.5);   // Scale uvs (to change)

    uvs.x = sin((uTime + uvs.x));

    gl_FragColor = vec4(uvs, 1., 1.);
}