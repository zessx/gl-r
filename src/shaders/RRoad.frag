#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec2 vUvs;
varying float vPerspective;

uniform vec2 uRez;
uniform float uTime;

const float PI = 3.14159265;
const vec3 RGB_NORMALIZER = vec3(1. / 255.);

const vec3 COLOR_WHITE =        vec3(255., 255., 255.);
const vec3 COLOR_BLACK =        vec3(0., 0., 0.);
const vec3 COLOR_YELLOW =       vec3(250., 235., 44.);
const vec3 COLOR_RED =          vec3(189., 9., 50.);
const vec3 COLOR_PINK_DARK =    vec3(245., 39., 137.);
const vec3 COLOR_PINK =         vec3(233., 0., 255.);
const vec3 COLOR_BLUE =         vec3(22., 133., 248.);
const vec3 COLOR_BLUE_DARK =    vec3(3., 33., 74.);
const vec3 COLOR_BLUE_DARKER =  vec3(1., 11., 25.); // https://www.color-hex.com/color-palette/35848
const vec3 COLOR_PURPLE_DARK =  vec3(61., 20., 76.);

void main() {
    vec2 uvs = vUvs;

    float speed = 25.;

    float maskX = step(1.99, sin(uvs.x * 50. * (2. * PI)) + 1.);
    float maskY = step(1.99, sin(uvs.y * 50. * (2. * PI) + uTime * speed) * -1. + 1.);
    float maskGrid = max(maskX, maskY);

    // Floor background
    vec3 color = mix(COLOR_BLUE_DARKER, COLOR_PINK, uvs.y / 2.) * RGB_NORMALIZER;

    // Grid
    if (maskGrid == 1.) {
        color = mix(COLOR_BLUE, COLOR_PURPLE_DARK, uvs.y) * RGB_NORMALIZER;
    }

    gl_FragColor = vec4(color, 0.1);

    gl_FragColor = vec4(color, 1.);
}
