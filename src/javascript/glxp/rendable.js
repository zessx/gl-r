class Rendable {

    constructor(scene){
        this.scene = scene
        this.gl = scene.gl
        this.uniforms = {}
    }

    initProgram(vert, frag) {

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
        shaderProgram.vertexUvAttribute = gl.getAttribLocation(shaderProgram, "aUvs")

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

export default Rendable