precision highp float;

varying vec2 vUvs;
varying float vPerspective;

uniform vec2 uRez;
uniform float uTime;

const float PI = 3.14159265;
const vec3 COLOR_YELLOW =       vec3(250., 235., 44.);
const vec3 COLOR_RED =          vec3(189., 9., 50.);
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

    // float yFlag = 1. - step(1.4, sin(pow((uvs.y + 1.), 2.) * 20. * (2. * PI) + uTime * 2.) + 1.);
    float yFlag = 1. - step(1.4, sin(exp(0.7 * (uvs.y + 1.)) * 20. * (2. * PI) + uTime * 2.) + 1.);

    float flag = distFlag * yFlag;

    vec3 color = mix(COLOR_YELLOW, COLOR_RED, uvs.y + 0.5) * vec3(flag / 255., flag / 255., flag / 255.);

    gl_FragColor = vec4(color, 1.);
}
