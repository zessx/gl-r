precision highp float; 

attribute vec3 aPos;
attribute vec2 aUvs;
attribute vec3 aNormal;

uniform mat4 uPMatrix;
uniform mat4 uMMatrix;
uniform mat4 uVMatrix;

uniform vec3 uLightPosition;

varying vec3 vWorldNormal;
varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vLPos;
varying vec2 vUv;

const float normalScale = .1;

void main(){

    vUv = aUvs;

    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPos, 1.0);

    vMPos = aPos;
    vLPos = vec4( uVMatrix * uMMatrix * vec4(uLightPosition, 1.) ).xyz;
    vPos = vec4(uVMatrix * uMMatrix * vec4(aPos, 1.0)).xyz;   
    vWorldNormal = normalize(mat3(uVMatrix * uMMatrix) * aNormal);

}