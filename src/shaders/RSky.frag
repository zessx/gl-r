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

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main() {
    vec2 uvs = vUvs;
    uvs -= vec2(0.5, 0.35);

    float speed = 1.;
    float radius =  0.3;
    float lines = (2. * PI) * 2000.;

    float dist = distance(vec2(0.), uvs.xy);

    float sunRadiusMask = 1. - step(radius, dist);
    float sunStripesMask = 1. - step(0.6, sin(sqrt((uvs.y + .3) * lines) + uTime * speed) + 1.);

    float sunMask = sunRadiusMask * sunStripesMask;

    float starMask = random(uvs.xy);

    float alpha = 1.;
    vec3 color = vec3(0., 0., 0.);

    // Sky background
    color = mix(COLOR_BLUE_DARKER, COLOR_PINK, uvs.y + 0.3) * RGB_NORMALIZER;

    // Striped sun
    if (sunMask == 1.) {
        color = mix(COLOR_YELLOW, COLOR_RED, uvs.y * 4. + 0.8) * RGB_NORMALIZER;
    }

    // Stars
    if (starMask >= 0.999) {
        color = mix(color, COLOR_WHITE * RGB_NORMALIZER, starMask);
    }

    // Horizon
    color = mix(color, COLOR_PINK * RGB_NORMALIZER, smoothstep(0.04, 0.10, uvs.y));

    gl_FragColor = vec4(color, 1.);
}
