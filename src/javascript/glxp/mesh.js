import glmat from 'gl-matrix'
import TextureLoader from './textureLoader'
import Node from './node'

let mat4 = glmat.mat4
let quat = glmat.quat
let vec3 = glmat.vec3

class Mesh {
    constructor(scene, geom) {

        this.scene = scene
        this.geom = geom
        this.gl = scene.gl

        this.node = new Node()

        this.initProgram()
        this.initBuffer()
        this.initVao()

        this.arDriven = false

    }

    initProgram() {

        let vert = require('../../shaders/default/default.vert')
        let frag = require('../../shaders/default/default.frag')

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
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
        shaderProgram.vertexUvAttribute = gl.getAttribLocation(shaderProgram, "aUvs");
        gl.enableVertexAttribArray(shaderProgram.vertexUvAttribute)
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute)

        // shaderProgram.uTimeUniform = gl.getUniformLocation(shaderProgram, "uTime")

        shaderProgram.pMatrixUniform         = gl.getUniformLocation(shaderProgram, "uPMatrix")
        shaderProgram.mMatrixUniform         = gl.getUniformLocation(shaderProgram, "uMMatrix")
        shaderProgram.vMatrixUniform         = gl.getUniformLocation(shaderProgram, "uVMatrix")

        shaderProgram.uTextureUniform       = gl.getUniformLocation(shaderProgram, "uTexture")
        // shaderProgram.uMatcapUniform         = gl.getUniformLocation(shaderProgram, "uMatcap")
        // shaderProgram.uNormalMapUniform      = gl.getUniformLocation(shaderProgram, "uNormalMap")

        // shaderProgram.uCameraPositionUniform = gl.getUniformLocation(shaderProgram, "uCameraPosition")
        // shaderProgram.uLightPositionUniform  = gl.getUniformLocation(shaderProgram, "uLightPosition")

        // shaderProgram.uNormalScaleUniform    = gl.getUniformLocation(shaderProgram, "uNormalScale")
        // shaderProgram.uNormalReapeatUniform  = gl.getUniformLocation(shaderProgram, "uNormalReapeat")
        // shaderProgram.uLigthStrengthUniform  = gl.getUniformLocation(shaderProgram, "uLigthStrength")

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

        gl.enableVertexAttribArray(this.program.vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
        gl.vertexAttribPointer(this.program.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)

        gl.bindVertexArray(null)

    }

    initBuffer() {

        let gl = this.gl

        let vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geom.vertices), gl.STATIC_DRAW)

        let uvsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geom.uvs), gl.STATIC_DRAW)

        let normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geom.normal), gl.STATIC_DRAW)

        let indicesBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geom.indices), gl.STATIC_DRAW)

        this.vertexPositionBuffer = vertexPositionBuffer
        this.uvsBuffer = uvsBuffer
        this.normalBuffer = normalBuffer

        this.indicesBuffer = indicesBuffer

    }

    bindMatrixUniforms(gl, program, camera) {
        gl.uniformMatrix4fv(program.pMatrixUniform, false, camera.getProjectionMatrix())
        gl.uniformMatrix4fv(program.vMatrixUniform, false, camera.getViewMatrix())
        gl.uniformMatrix4fv(program.mMatrixUniform, false, this.node.getMatrix())
    }

    applyState() {
        let gl = this.gl
        this.scene.applyDefaultState()
        // gl.disable(gl.DEPTH_TEST)

        // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
        // gl.enable(gl.BLEND)
    }

    render() {

        let gl = this.gl

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)
        this.applyState()

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, TextureLoader.getTexture("bake"))
        gl.uniform1i(this.program.uTextureUniform, 0)
        
        this.bindMatrixUniforms(gl, this.program, this.scene.camera)
        gl.drawElements(gl.TRIANGLES, this.geom.indices.length, gl.UNSIGNED_SHORT, 0)

        gl.bindVertexArray(null)

    }


}

export default Mesh