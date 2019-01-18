precision highp float;

uniform sampler2D uProjectPic;
uniform vec2      uImgSize;
uniform vec2      uPlaneScale;
uniform vec3      uIdColor;
uniform float     uIsColorPass;

varying vec2 vUv;

void main() {

    vec2 s = uPlaneScale;
    vec2 i1 = uImgSize; 
    float rs1 = s.x / s.y;
    float ri1 = i1.x / i1.y;
    vec2 new1 = rs1 < ri1 ? vec2(i1.x * s.y / i1.y, s.y) : vec2(s.x, i1.y * s.x / i1.x);
    vec2 offset1 = (rs1 < ri1 ? vec2((new1.x - s.x) / 2.0, 0.0) : vec2(0.0, (new1.y - s.y) / 2.0)) / new1;
    vec2 uvV1 = vUv * s / new1 + offset1;



    gl_FragColor = mix(texture2D( uProjectPic, uvV1 ), vec4(uIdColor, 1.0), uIsColorPass);
    // gl_FragColor = vec4(vUv, 0., 1.);
}