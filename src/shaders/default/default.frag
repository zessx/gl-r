precision highp float;

uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D( uTexture, vec2(vUv.x, vUv.y) );
}