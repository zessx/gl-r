precision highp float;

varying vec2 vUvs;
varying float vPerspective;

uniform vec2 uRez;
uniform float uTime;

const float PI = 3.14159265;
const vec3 COLOR_YELLOW =       vec3(250., 235., 44.);
const vec3 COLOR_PINK_DARK =    vec3(245., 39., 137.);
const vec3 COLOR_PINK =         vec3(233., 0., 255.);
const vec3 COLOR_BLUE =         vec3(22., 133., 248.);
const vec3 COLOR_PURPLE_DARK =  vec3(61., 20., 76.);

void main() {
    vec2 uvs = vUvs;

    float nbLines = 200.;

    // Vertical lines
    float flagX = step(1.999, sin(uvs.x * nbLines * (2. * PI)) + 1.);
    // Horizontal lines
    float flagY = step(1.999, sin(uvs.y * (uTime / 1000.) * nbLines * vPerspective * (2. * PI)) * -1. + 1.);
    // Grid
    float flag = max(flagX, flagY);

    vec3 color = COLOR_PINK * vec3(flag / 255.);

    gl_FragColor = vec4(color, 1.);
}