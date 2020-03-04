precision highp float;

varying vec3 vPos;
varying vec2 vUvs;

uniform vec2 uRez;
uniform float uTime;

const vec3 COLOR_YELLOW =       vec3(250., 235., 44.);
const vec3 COLOR_PINK_DARK =    vec3(245., 39., 137.);
const vec3 COLOR_PINK =         vec3(233., 0., 255.);
const vec3 COLOR_BLUE =         vec3(22., 133., 248.);
const vec3 COLOR_PURPLE_DARK =  vec3(61., 20., 76.);

void main() {
    vec3 color = COLOR_BLUE * vec3(1. / 255.);

    gl_FragColor = vec4(color, 1.);
}