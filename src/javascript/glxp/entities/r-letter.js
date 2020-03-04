const VERTICES = [
    -0.75,  0.875, 0,   -0.5,  0.875, 0,   -0.25,  0.875, 0,   0,  0.875, 0,   0.25,  0.875, 0,   0.5,   0.875, 0,
    -0.75,  0.625, 0,   -0.5,  0.625, 0,   -0.25,  0.625, 0,   0,  0.625, 0,   0.25,  0.625, 0,   0.5,   0.625, 0,   0.75,  0.625, 0,
    -0.75,  0.375, 0,   -0.5,  0.375, 0,   -0.25,  0.375, 0,                   0.25,  0.375, 0,   0.5,   0.375, 0,   0.75,  0.375, 0,
    -0.75,  0.125, 0,   -0.5,  0.125, 0,   -0.25,  0.125, 0,   0,  0.125, 0,   0.25,  0.125, 0,   0.5,   0.125, 0,   0.75,  0.125, 0,
    -0.75, -0.125, 0,   -0.5, -0.125, 0,   -0.25, -0.125, 0,   0, -0.125, 0,   0.25, -0.125, 0,   0.5,  -0.125, 0,   0.75, -0.125, 0,
    -0.75, -0.375, 0,   -0.5, -0.375, 0,   -0.25, -0.375, 0,   0, -0.375, 0,   0.25, -0.375, 0,   0.5,  -0.375, 0,   0.75, -0.375, 0,
    -0.75, -0.625, 0,   -0.5, -0.625, 0,   -0.25, -0.625, 0,                   0.25, -0.625, 0,   0.5,  -0.625, 0,   0.75, -0.625, 0,
    -0.75, -0.875, 0,   -0.5, -0.875, 0,   -0.25, -0.875, 0,                   0.25, -0.875, 0,   0.5,  -0.875, 0,   0.75, -0.875, 0,
]

const INDICES = [
    0, 1, 6, 1, 6, 7, 1, 2, 7, 2, 7, 8, 2, 3, 8, 3, 8, 9, 3, 4, 9, 4, 9, 10, 4, 5, 10, 5, 10, 11,
    6, 7, 13, 7, 13, 14, 7, 8, 14, 8, 14, 15, 10, 11, 16, 11, 16, 17, 11, 12, 17, 12, 17, 18,
    13, 14, 19, 14, 19, 20, 14, 15, 20, 15, 20, 21, 16, 17, 23, 17, 23, 24, 17, 18, 24, 18, 24, 25,
    19, 20, 26, 20, 26, 27, 20, 21, 27, 21, 27, 28, 21, 22, 28, 22, 28, 29, 22, 23, 29, 23, 29, 30, 23, 24, 30, 24, 30, 31, 24, 25, 31, 25, 31, 32,
    26, 27, 33, 27, 33, 34, 27, 28, 34, 28, 34, 35, 28, 29, 35, 29, 35, 36, 29, 30, 36, 30, 36, 37, 30, 31, 37, 31, 37, 38,
    33, 34, 40, 34, 40, 41, 34, 35, 41, 35, 41, 42, 37, 38, 43, 38, 43, 44, 38, 39, 44, 39, 44, 45,
    40, 41, 46, 41, 46, 47, 41, 42, 47, 42, 47, 48, 43, 44, 49, 44, 49, 50, 44, 45, 50, 45, 50, 51,
]

const UVS = [
    -0.75,  0.875,   -0.5,  0.875,   -0.25,  0.875,   0,  0.875,   0.25,  0.875,   0.5,   0.875,
    -0.75,  0.625,   -0.5,  0.625,   -0.25,  0.625,   0,  0.625,   0.25,  0.625,   0.5,   0.625,   0.75,  0.625,
    -0.75,  0.375,   -0.5,  0.375,   -0.25,  0.375,                0.25,  0.375,   0.5,   0.375,   0.75,  0.375,
    -0.75,  0.125,   -0.5,  0.125,   -0.25,  0.125,   0,  0.125,   0.25,  0.125,   0.5,   0.125,   0.75,  0.125,
    -0.75, -0.125,   -0.5, -0.125,   -0.25, -0.125,   0, -0.125,   0.25, -0.125,   0.5,  -0.125,   0.75, -0.125,
    -0.75, -0.375,   -0.5, -0.375,   -0.25, -0.375,   0, -0.375,   0.25, -0.375,   0.5,  -0.375,   0.75, -0.375,
    -0.75, -0.625,   -0.5, -0.625,   -0.25, -0.625,                0.25, -0.625,   0.5,  -0.625,   0.75, -0.625,
    -0.75, -0.875,   -0.5, -0.875,   -0.25, -0.875,                0.25, -0.875,   0.5,  -0.875,   0.75, -0.875,
]

class RLetter {

    constructor(scene) {

        this.scene = scene
        this.gl = scene.gl

        this.vertShader = require('../../../shaders/r.vert')
        this.fragShader = require('../../../shaders/r.frag')

        this.initProgram()
        this.initBuffer({
            vertices: VERTICES,
            indices: INDICES,
            uvs: UVS,
        })

        this.uniforms = {}

        this.createUniform('uRez', 'float2');
        this.createUniform('uImgRez', 'float2');
        this.createUniform('uTime');

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


        this.bindUniform('uRez', [this.scene.width, this.scene.height])

        this.bindUniform('uTime', this.scene.time)

        /**
         * Draw
         */
        gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)

    }

    /**
     *******************************
     *******************************
     *******************************
     */


    initProgram() {

        let gl = this.gl

        /**
         * Compile shaders
         */
        let vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, this.vertShader)
        gl.compileShader(vertShader)

        let fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragShader, this.fragShader)
        gl.compileShader(fragShader)

        /**
         * Display shaders compilation errors
         */
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            console.error('error vert', gl.getShaderInfoLog(vertShader))
            return null
        }

        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            console.error('error frag', gl.getShaderInfoLog(fragShader))
            return null
        }

        /**
         * Create a program based on these two shaders
         */
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader)
        gl.attachShader(shaderProgram, fragShader)
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
        this.fragShader = fragShader
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

}

export default RLetter