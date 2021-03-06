precision highp float;

varying vec3 vPos;
varying vec2 vUvs;

uniform sampler2D uTexture;
uniform vec2 uRez;
uniform vec2 uImgRez;
uniform float uTime;
uniform vec2 uMouse;

const float discRadius = 0.1;
const float borderWidth = 0.03;

void main() {
    // vec2 uvs = vUvs;
    // float ratio = uRez.x / uRez.y;
    // float ratioImg = uImgRez.x / uImgRez.y;

    // uvs -= vec2(0.5);
    // uvs.y /= ratio;
    // uvs.y *= ratioImg;
    // uvs += vec2(0.5);

    // Scale
    vec2 s = uRez;
    vec2 i1 = uImgRez;
    float rs1 = s.x / s.y;
    float ri1 = i1.x / i1.y;
    vec2 new1 = rs1 < ri1 ? vec2(i1.x * s.y / i1.y, s.y) : vec2(s.x, i1.y * s.x / i1.x);
    vec2 offset1 = (rs1 < ri1 ? vec2((new1.x - s.x) / 2.0, 0.0) : vec2(0.0, (new1.y - s.y) / 2.0)) / new1;
    vec2 uvs = vUvs * s / new1 + offset1;

    // Scroll
    // uvs.x += uTime * 0.05;

    // uvs += uMouse / 2.;

    vec2 c = vUvs;
    c -= vec2(.5);
    c -= uMouse / 2.;
    c.x *= rs1;
    float dist = sqrt(dot(c, c));
    float t = 1. - smoothstep(discRadius - borderWidth, discRadius + borderWidth, dist);

    uvs += (t * 0.05);

    vec4 color = texture2D(uTexture, uvs);
    gl_FragColor = color;

    // gl_FragColor = vec4(vec3(t), 1.);
}