#extension GL_OES_standard_derivatives : enable

// e = vPos
// n = vWorldNormal

precision highp float; 

varying vec3 vWorldNormal;
varying vec3 vPos;
varying vec2 vUv;
varying vec3 vMPos;
varying vec3 vLPos;

uniform vec3 uCameraPosition;

uniform sampler2D uMatcap;
uniform sampler2D uNormalMap;
uniform float uNormalScale;
uniform float uAOStrength;
uniform float uNormalReapeat;
uniform float uLigthStrength;


const vec3 lightPos = vec3(1.0, 1. , 0.);

mat3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm) {

    vec3 q0 = dFdx( eye_pos.xyz );
    vec3 q1 = dFdy( eye_pos.xyz );
    vec2 st0 = dFdx( vUv.st );
    vec2 st1 = dFdy( vUv.st );

    vec3 S = normalize( q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    vec3 N = normalize( surf_norm );

    return mat3( S, T, N );

}

void main() {

    vec3 viewDir = normalize(uCameraPosition - vPos);
    vec3 lightDir = normalize(vLPos - vPos);

    vec2 uv = vec2(vUv.x, -vUv.y);

    vec3 normal = normalize(vWorldNormal);
    vec3 mapN = texture2D( uNormalMap, uv * uNormalReapeat ).xyz * 2.0 - 1.0;
    mapN.xy = uNormalScale * mapN.xy;
    mat3 tsn = perturbNormal2Arb(pow(viewDir, vec3(6.)), normal);

    normal = normalize( tsn * mapN * .5 );
    vec3 reflectDirLight = reflect(-lightDir, normal);
    

    vec3 r = reflect( vPos, normal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;
    vec2 vO = (vN - .5) * 2.;

    vec3 base = texture2D( uMatcap, vN ).rgb;    

    // vec3 color = normalize();
    gl_FragColor = vec4( base, 1.0);
    
    

}