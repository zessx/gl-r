precision highp float;

varying vec2 vUvs;
varying float vPerspective;

uniform vec2 uRez;
uniform float uTime;

const float PI = 3.14159265;

void main() {
    vec2 uvs = vUvs;

    float nbLines = 200.;

    // Vertical lines
    float flagX = step(1.999, sin(uvs.x * nbLines * (2. * PI)) + 1.);

    // Horizontal lines
    float flagY = step(1.999, sin(uvs.y * nbLines * (vPerspective / 7.) * (2. * PI)) + 1.);
    // flagY = 0.;

    float flag = max(flagX, flagY);

    // vec3 rgbColor = vec3(218., 66., 245.);
    // vec3 color = dot(rgbColor, vec3(flag / 255.));

    vec3 color = vec3(218. / 255. * flag, 66. / 255. * flag, 245. / 255. * flag);

    gl_FragColor = vec4(color, 1.);
}