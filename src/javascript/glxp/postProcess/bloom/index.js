import glmat from 'gl-matrix'
import GEOM from '../geom'
import PostProcessRT from '../postProcessRT'

import ThresholdPass from './threshold'
import Blur from './blur'

let mat4 = glmat.mat4
let quat = glmat.quat
let vec3 = glmat.vec3
let vec2 = glmat.vec2

class PostEffect {
    constructor(scene) {

        this.scene = scene

        this.gl = scene.gl

        this.initProgram()
        this.initBuffer()
        this.initVao()
        this.rt = new PostProcessRT(this.scene)

        this.thresholdPass = new ThresholdPass(this.scene, {
            pixelRatio: .5,
            previousPass: this
        })

        this.blurPasses = []
        this.blurPasses.push(new Blur(this.scene, {
            pixelRatio: .5,
            previousPass: this.thresholdPass,
            strenght: [3, 1]
        }))
        this.blurPasses.push(new Blur(this.scene, {
            pixelRatio: .5,
            previousPass: this.blurPasses[0],
            strenght: [1, 3]
        }))

    }

    initProgram() {

        let vert = require('../../../../shaders/bloom/bloom.vert')
        let frag = require('../../../../shaders/bloom/bloom.frag')

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

        shaderProgram.uTextureUniform = gl.getUniformLocation(shaderProgram, "uTexture")
        shaderProgram.uGlowUniform = gl.getUniformLocation(shaderProgram, "uGlow")

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

    renderPass(){
        this.thresholdPass.render()
        this.blurPasses.forEach(blur => {
            blur.render()
        })
    }

    render() {

        let gl = this.gl

        this.gl.viewport(0, 0, this.scene.width, this.scene.height)

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)
        this.applyState()

        gl.activeTexture(gl.TEXTURE0)
        this.rt.bind()
        gl.uniform1i(this.program.uTextureUniform, 0)

        gl.activeTexture(gl.TEXTURE1)
        this.blurPasses[this.blurPasses.length - 1].rt.bind()
        gl.uniform1i(this.program.uGlowUniform, 1)
        
        gl.uniform2fv(this.program.uRezUniform, [this.scene.width, this.scene.height])

        gl.drawElements(gl.TRIANGLES, GEOM.indices.length, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null)

    }


}

export default PostEffect