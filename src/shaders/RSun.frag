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

    float speed = 1.;
    float radius =  0.3;
    float lines = (2. * PI) * 2000.;

    float dist = sqrt(pow(uvs.x, 2.) + pow(uvs.y, 2.));
    float distMask = 1. - step(radius, dist);

    // float yMask = 1. - step(.7, pow(sin(exp(0.7 * (uvs.y + 1.)) * lines + uTime * speed), 2.));
    // float yMask = 1. - step(.7, pow(sin(uvs.y * lines + uTime * speed), 2.));
    // float yMask = 1. - step(0.6, sin((uvs.y + .5) * (uvs.y + .5) / 4. * lines + uTime * speed) + 1.);
    float yMask = 1. - step(0.6, sin(sqrt((uvs.y + .3) * lines) + uTime * speed) + 1.);

    float mask = distMask * yMask;
    float rMask = mask - 1. * -1.;

    vec3 color = mix(COLOR_YELLOW, COLOR_RED, uvs.y * 4. + 0.8) * vec3(mask / 255.);

    gl_FragColor = vec4(color, 1.);
}
