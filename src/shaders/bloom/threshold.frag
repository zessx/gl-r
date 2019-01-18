precision highp float;

uniform sampler2D uTexture;
uniform vec2 uRez;

varying vec2 vUv;

const float t = 0.38;

float czm_luminance(vec3 rgb)
{
    // Algorithm from Chapter 10 of Graphics Shaders.
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    return dot(rgb, W);
}

void main() {
    vec3 color = texture2D( uTexture, vUv).rgb;
    float lum = czm_luminance(color);

    vec2 uv = vUv;
    uv -= vec2(.5);
    float dist = sqrt(dot(uv, uv));
    float d = smoothstep(.38+.1, .38-.1, dist);

    float c = smoothstep(t,1.0,lum);
    color = vec3(c * d);

    // if (lum < .7) {
    //     color = vec3(0.);
    // }

	gl_FragColor.xyz = color;
	gl_FragColor.w = 1.0;
}