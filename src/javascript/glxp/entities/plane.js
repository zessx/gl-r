const VERTICES = [
    -1, 1, 0,
    -1, -1, 0,
    1, -1, 0,
    1, 1, 0,
]

const INDICES = [
    0, 1, 2, 0, 2, 3
]

const UVS = [
    0, 0,
    0, 1,
    1, 1,
    1, 0,
]

import TextureLoader from '../textureLoader';
import Mouse from '../mouse';

class Plane {
    constructor(scene) {

        this.scene = scene
        this.gl = scene.gl

        this.vertShader = require('../../../shaders/plane.vert')
        this.fragShader = require('../../../shaders/plane.frag')

        this.initProgram()
        this.initBuffer({
            vertices: VERTICES,
            indices: INDICES,
            uvs: UVS,
        })

        this.uniforms = {}

        this.createUniform('uTexture', 'texture');
        this.createUniform('uRez', 'float2');
        this.createUniform('uImgRez', 'float2');
        this.createUniform('uTime');
        this.createUniform('uMouse', 'float2');

    }

    initProgram() {

        let gl = this.gl

        /**
         * Compile shaders
         */
        let vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, this.vertShader)
        gl.compileShader(vertShader)

        let fragSahder = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragSahder, this.fragShader)
        gl.compileShader(fragSahder)

        /**
         * Display shaders compilation errors
         */
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            console.error('error vert', gl.getShaderInfoLog(vertShader))
            return null
        }

        if (!gl.getShaderParameter(fragSahder, gl.COMPILE_STATUS)) {
            console.error('error frag', gl.getShaderInfoLog(fragSahder))
            return null
        }

        /**
         * Create a program based on these two shaders
         */
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader)
        gl.attachShader(shaderProgram, fragSahder)
        gl.linkProgram(shaderProgram)

        /**
         * Display program linking errors
         */
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("Could not initialise shaders", gl.getProgramInfoLog(shaderProgram));
        }

        /**
         * Activate the program
         */
        gl.useProgram(shaderProgram)
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos")
        shaderProgram.vertexUvAttribute = gl.getAttribLocation(shaderProgram, "aUvs")

        this.vertShader = vertShader
        this.fragSahder = fragSahder
        this.program = shaderProgram

    }

    initBuffer(geom) {

        let gl = this.gl

        let vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.vertices), gl.STATIC_DRAW)

        let uvsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.uvs), gl.STATIC_DRAW)

        let indicesBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geom.indices), gl.STATIC_DRAW)

        this.vertexPositionBuffer = vertexPositionBuffer
        this.uvsBuffer = uvsBuffer
        this.indicesBuffer = indicesBuffer

    }

    createUniform(name, type = "float1"){
        this.program[name + "Uniform"] = this.gl.getUniformLocation(this.program, name)
        this.uniforms[name + "Uniform"] = {
            name: name,
            type: type,
            uniform: this.program[name + "Uniform"]
        }
        return this.program[name + "Uniform"]
    }

    bindUniform(name, value){
        let gl = this.gl
        if (this.uniforms[name + "Uniform"].type == "texture") {
            gl.uniform1i(this.program[name + "Uniform"], value)
        } else if (this.uniforms[name + "Uniform"].type == "float1") {
            gl.uniform1f(this.program[name + "Uniform"], value)
        } else if (this.uniforms[name + "Uniform"].type == "float2") {
            gl.uniform2fv(this.program[name + "Uniform"], value)
        } else if (this.uniforms[name + "Uniform"].type == "float3") {
            gl.uniform3fv(this.program[name + "Uniform"], value)
        } else if (this.uniforms[name + "Uniform"].type == "mat4") {
            gl.uniformMatrix4fv(this.program[name + "Uniform"], false, value)
        }
    }

    render() {

        let gl = this.gl

        gl.useProgram(this.program)

        gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer)
        gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

        gl.enableVertexAttribArray(this.program.vertexUvAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
        gl.vertexAttribPointer(this.program.vertexUvAttribute, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, TextureLoader.getTexture('mountains'))
        this.bindUniform('uTexture', 0)

        this.bindUniform('uRez', [this.scene.width, this.scene.height])

        let img = TextureLoader.getImage('mountains');
        this.bindUniform('uImgRez', [img.width, img.height])

        this.bindUniform('uTime', this.scene.time)
        this.bindUniform('uMouse', Mouse.cursor)

        /**
         * Draw
         */
        gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)

    }
}

export default Plane