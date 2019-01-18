import glmat from 'gl-matrix'
import GEOM from '../geom'
import PostProcessRT from '../postProcessRT'
import Mouse from '../../mouse'

let mat4 = glmat.mat4
let quat = glmat.quat
let vec3 = glmat.vec3
let vec2 = glmat.vec2

class PostEffect {
    constructor(scene, options) {

        this.scene = scene
        this.gl = scene.gl
        this.options = options || {}
        this.pixelRatio = this.options.pixelRatio || 1

        this.sunPos = vec2.create()

        this.initProgram()
        this.initBuffer()
        this.initVao()

        this.rt = new PostProcessRT(this.scene, this.pixelRatio)

    }

    initProgram() {

        let vert = require('../../../../shaders/flare/flare.vert')
        let frag = require('../../../../shaders/flare/flare.frag')

        let gl = this.gl

        let vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, vert)
        gl.compileShader(vertShader)

        let fragSahder = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragSahder, frag)
        gl.compileShader(fragSahder)

        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            console.error('error vert', gl.getShaderInfoLog(vertShader))
            return null
        }

        if (!gl.getShaderParameter(fragSahder, gl.COMPILE_STATUS)) {
            console.error('error frag', gl.getShaderInfoLog(fragSahder))
            return null
        }

        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader)
        gl.attachShader(shaderProgram, fragSahder)
        gl.linkProgram(shaderProgram)

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("Could not initialise shaders", gl.getProgramInfoLog(shaderProgram));
        }

        gl.useProgram(shaderProgram)
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos")
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
        shaderProgram.vertexUvAttribute = gl.getAttribLocation(shaderProgram, "aUv")
        gl.enableVertexAttribArray(shaderProgram.vertexUvAttribute)

        shaderProgram.uRezUniform = gl.getUniformLocation(shaderProgram, "uRez")
        shaderProgram.uSunCoordUniform = gl.getUniformLocation(shaderProgram, "uSunCoord")
        shaderProgram.uSunPowerUniform = gl.getUniformLocation(shaderProgram, "uSunPower")

        this.vertShader = vertShader
        this.fragSahder = fragSahder
        this.program = shaderProgram

    }

    initVao() {

        let gl = this.gl

        this.vao = gl.createVertexArray()

        gl.bindVertexArray(this.vao)

        gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer)
        gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

        gl.enableVertexAttribArray(this.program.vertexUvAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
        gl.vertexAttribPointer(this.program.vertexUvAttribute, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)

        gl.bindVertexArray(null)

    }

    initBuffer() {

        let gl = this.gl

        let vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(GEOM.vertices), gl.STATIC_DRAW)

        let uvsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(GEOM.uvs), gl.STATIC_DRAW)

        let indicesBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(GEOM.indices), gl.STATIC_DRAW)

        this.vertexPositionBuffer = vertexPositionBuffer
        this.uvsBuffer = uvsBuffer

        this.indicesBuffer = indicesBuffer

    }

    applyState() {
        let gl = this.gl
        this.scene.applyDefaultState()
        gl.disable(gl.DEPTH_TEST)
    }

    preRender() {
        this.rt.preRender()
    }

    postRender() {
        this.rt.postRender()
    }

    render() {

        this.preRender()

        this.sunPos[0] = -this.scene.cameraPosition[0] / 5
        this.sunPos[1] = -this.scene.cameraPosition[1] / 5
        // this.sunPos[0] += PostProcessConfig.getActiveConfigValueForKey("sunPosistionX")

        // this.sunPos[1] = (.5 - this.scene.controller.cameraPosition[0] / (this.scene.controller.tiltFactor * 6) * -1)
        // this.sunPos[1] += PostProcessConfig.getActiveConfigValueForKey("sunPosistionY")       

        let gl = this.gl

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)
        this.applyState()

        gl.uniform2fv(this.program.uRezUniform, [this.scene.width, this.scene.height])
        gl.uniform2fv(this.program.uSunCoordUniform, this.sunPos)
        gl.uniform1f(this.program.uSunPowerUniform, 0)        

        gl.drawElements(gl.TRIANGLES, GEOM.indices.length, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null)

        this.postRender()

    }


}

export default PostEffect