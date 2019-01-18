precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uGlow;

varying vec2 vUv;

void main() {
    vec3 color = texture2D( uTexture, vUv).rgb;
    vec3 glow = texture2D( uGlow, vUv).rgb;
    
	gl_FragColor.xyz =  color + (glow * 10.5);
	// gl_FragColor.xyz =  glow;
	gl_FragColor.w = 1.0;
}