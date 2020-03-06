precision highp float;

varying vec2 vUvs;

uniform vec2 uRez;

const vec3 COLOR_WHITE =        vec3(255., 255., 255.);
const vec3 COLOR_BLACK =        vec3(0., 0., 0.);
const vec3 COLOR_YELLOW =       vec3(250., 235., 44.);
const vec3 COLOR_RED =          vec3(189., 9., 50.);
const vec3 COLOR_PINK_DARK =    vec3(245., 39., 137.);
const vec3 COLOR_PINK =         vec3(233., 0., 255.);
const vec3 COLOR_BLUE =         vec3(22., 133., 248.);
const vec3 COLOR_PURPLE_DARK =  vec3(61., 20., 76.);

void main() {
    vec2 uvs = vUvs;
    uvs -= vec2(0.5);

    vec3 color = mix(COLOR_PINK, COLOR_BLACK, 4. * abs(uvs.y)) * vec3(1. / 255.);

    gl_FragColor = vec4(color, 1.);
}
