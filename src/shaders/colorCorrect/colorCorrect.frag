precision highp float;

uniform float uStaturation; // 1.35
uniform float uBrightness; //  -.1
uniform float uContrast;  // 1.25

uniform sampler2D uTexture;
varying vec2 vUv;

vec3 brightnessContrast(vec3 value, float brightness, float contrast) {
    return (value - 0.5) * contrast + 0.5 + brightness;
}

vec3 czm_saturation(vec3 rgb, float adjustment)
{
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

void main() {
    vec3 color = texture2D( uTexture, vUv ).rgb;
    color = czm_saturation(color, uStaturation);
    color = brightnessContrast(color, uBrightness, uContrast);
    gl_FragColor = vec4(color, 1);
}