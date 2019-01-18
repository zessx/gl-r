precision highp float;

uniform sampler2D uDisplacement;
uniform sampler2D uVideo1;
uniform sampler2D uVideo2;
uniform vec2      uRez;
uniform vec2      uVideo1Rez;
uniform vec2      uVideo2Rez;
uniform vec2      uMouse;

uniform float     uCircleRadius;
uniform float     uOpacity;

varying vec2      vUv;

const float border = 0.3;

uniform float uTime;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main() {

    // Video 1 
    vec2 s = uRez;
    vec2 i1 = uVideo1Rez; 
    float rs1 = s.x / s.y;
    float ri1 = i1.x / i1.y;
    vec2 new1 = rs1 < ri1 ? vec2(i1.x * s.y / i1.y, s.y) : vec2(s.x, i1.y * s.x / i1.x);
    vec2 offset1 = (rs1 < ri1 ? vec2((new1.x - s.x) / 2.0, 0.0) : vec2(0.0, (new1.y - s.y) / 2.0)) / new1;
    vec2 uvV1 = vUv * s / new1 + offset1;
    
    vec2 i2 = uVideo2Rez;
    float rs2 = s.x / s.y;
    float ri2 = i2.x / i2.y;
    vec2 new2 = rs2 < ri2 ? vec2(i2.x * s.y / i2.y, s.y) : vec2(s.x, i2.y * s.x / i2.x);
    vec2 offset2 = (rs2 < ri2 ? vec2((new2.x - s.x) / 2.0, 0.0) : vec2(0.0, (new2.y - s.y) / 2.0)) / new2;
    vec2 uvV2 = vUv * s / new2 + offset2;

    // vec2 uvDis = vec2((vUv.x + (uTime * uProgress) * 0.1), vUv.y);
    // uvDis *= scale;

    vec2 cuv = vUv - vec2(.5);
    cuv -= uMouse * .5;
    cuv.y /= uRez.x/uRez.y;
    float dist =  sqrt(dot(cuv, cuv));

    float r = random(vec2(vUv + uTime * 0.1)) * .2;

    float b = border;
    float t = 1. - (1.0 + smoothstep(uCircleRadius, uCircleRadius+b, dist) - smoothstep(uCircleRadius-b, uCircleRadius, dist));
    b *= 0.6;
    float d = smoothstep(uCircleRadius+b, uCircleRadius-b, dist);

    float disp = pow(texture2D( uDisplacement, vUv ).r, 2.0);

    uvV1.x += disp * 0.5 * t * uCircleRadius;
    uvV2.x -= disp * 0.5 * max(t - d,  0.);
    vec3 video1 = texture2D( uVideo1, uvV1 ).rgb;
    vec3 video2 = texture2D( uVideo2, uvV2 ).rgb;


    gl_FragColor = vec4(mix(video1, video2, d), uOpacity); 
    gl_FragColor += r; 
    // gl_FragColor = vec4(vec3(r), 1.0);
}