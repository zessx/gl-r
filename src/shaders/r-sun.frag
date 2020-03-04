#extension GL_OES_standard_derivatives : enable

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
    uvs -= vec2(0.5, 0.35);

    float speed = 5.;
    float radius =  0.3;

    float dist = sqrt(pow(uvs.x, 2.) + pow(uvs.y, 2.));
    float distFlag = 1. - step(radius, dist);

    float yFlag = 1. - step(1.4, sin(pow(uvs.y / (radius * 2.), 1.7) * 30. * (2. * PI) - 1.72) + 1.);

    float flag = distFlag * yFlag;

    vec3 color = COLOR_YELLOW * vec3(flag / 255. / (dist * 3.), flag / 255. * (dist * 3.5), flag / 255.);

    gl_FragColor = vec4(color, 1.);
}