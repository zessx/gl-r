precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uFlareTexture;
uniform float uFlareOpacity;

varying vec2 vUv;

float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
    vec3 color = texture2D( uTexture, vUv ).rgb;
    vec3 flare = texture2D( uFlareTexture, vUv ).rgb * 1.;
    // flare += vec3(0.7, 0.7, 0.74);
    // flare = pow(flare, vec3(4.));
    // gl_FragColor = vec4(flare, 1.);
    // gl_FragColor = vec4(blendMultiply(color, flare, .1), 1.);
    gl_FragColor = vec4(blendScreen(flare, color), 1.);
}