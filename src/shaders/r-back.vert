precision highp float;

attribute vec3 aPos;

void main(void) {
    gl_Position = vec4(aPos, 1.0);
}