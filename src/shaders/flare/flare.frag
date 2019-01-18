/*
	Originaly made by Musk 
	https://www.shadertoy.com/view/4sX3Rs
*/

precision highp float;

varying vec2 vUv;

uniform vec2 uRez;
uniform vec2 uSunCoord;
uniform float uSunPower;

vec3 lensflare(vec2 uv,vec2 pos)
{
	vec2 main = uv-pos;
	vec2 uvd = uv*(length(uv));
	
	float ang = atan(main.x,main.y);
	float dist=length(main); dist = pow(dist,.1);
	
	vec2 uvx = mix(uv,uvd,-0.5);
	
	float f4 = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
	float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;
	float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;
	
	uvx = mix(uv,uvd,-.4);
	
	float f5 = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
	float f52 = max(0.01-pow(length(uvx+0.4*pos),5.5),.0)*2.0;
	float f53 = max(0.01-pow(length(uvx+0.6*pos),5.5),.0)*2.0;
	
	uvx = mix(uv,uvd,-0.5);
	
	float f6 = max(0.01-pow(length(uvx-0.3*pos),1.6),.0)*6.0;
	float f62 = max(0.01-pow(length(uvx-0.325*pos),1.6),.0)*3.0;
	float f63 = max(0.01-pow(length(uvx-0.35*pos),1.6),.0)*5.0;
	
	vec3 c = vec3(.0);
	
	c.r+=f4+f5+f6; c.g+=f42+f52+f62; c.b+=f43+f53+f63;
	c = c*1.3 - vec3(length(uvd)*.05);
	// c+=vec3(f0);
	
	return c;
}

vec3 cc(vec3 color, float factor,float factor2) // color modifier
{
	float w = color.x+color.y+color.z;
	return mix(color,vec3(w)*factor,w*factor2);
}


void main() {

    vec2 uv = vUv -.5;
	uv.x *= uRez.x/uRez.y; //fix aspect ratio

	vec2 sunPos = uSunCoord * .5;
	sunPos.x *= uRez.x/uRez.y; //fix aspect ratio
	
	vec3 color = vec3(1.3,1.2,1.0)*lensflare(uv,sunPos.xy);
	gl_FragColor = vec4(color,1.0);

}