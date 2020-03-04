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

import TextureLoader from '../textureLoader'
import Mouse from '../mouse'
import Node from '../node'
import PlaneGeom from '../planeGeom'

class Plane {
    constructor(scene) {

        this.scene = scene
        this.gl = scene.gl

        this.vertShader = require('../../../shaders/planeWave.vert')
        this.fragShader = require('../../../shaders/planeWave.frag')

        this.geom = new PlaneGeom(3, 2, 20, 20)

        this.initProgram()
        this.initBuffer({
            vertices: this.geom.vertices,
            indices: this.geom.indices,
            uvs: this.geom.uvs,
        })

        this.uniforms = {}

        this.node = new Node()
        this.node.scale[1] = -1;

        this.createUniform('uTexture', 'texture')
        this.createUniform('uRez', 'float2')
        this.createUniform('uImgRez', 'float2')
        this.createUniform('uTime')
        this.createUniform('uMouse', 'float2')

        this.createUniform('uModelMatrix', 'mat4')
        this.createUniform('uViewMatrix', 'mat4')
        this.createUniform('uProjectionMatrix', 'mat4')

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

        gl.enable(gl.DEPTH_TEST)

        gl.useProgram(this.program)

        gl.enableVertexAttribArray(this.program.vertexPositionAttribute)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer)
        gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

        gl.enableVertexAttribArray(this.program.vertexUvAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
        gl.vertexAttribPointer(this.program.vertexUvAttribute, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, TextureLoader.getTexture('mountains'))
        this.bindUniform('uTexture', 0)

        // Rotate Scene
        // this.node.rotation[1] += this.scene.dt / 1000
        // this.node.needUpdate = true

        this.bindUniform('uRez', [this.scene.width, this.scene.height])

        let img = TextureLoader.getImage('mountains')
        this.bindUniform('uImgRez', [img.width, img.height])

        this.bindUniform('uTime', this.scene.time)
        this.bindUniform('uMouse', Mouse.cursor)

        this.bindUniform('uModelMatrix', this.node.getMatrix())
        this.bindUniform('uViewMatrix', this.scene.camera.getViewMatrix())
        this.bindUniform('uProjectionMatrix', this.scene.camera.getProjectionMatrix())

        /**
         * Draw
         */
        gl.drawElements(gl.TRIANGLES, this.geom.indices.length, gl.UNSIGNED_SHORT, 0)

    }
}

export default Plane