import Node from '../node'

class Rendable {

    constructor(scene){
        this.scene = scene
        this.gl = scene.gl
        this.uniforms = {}

        this.hasNormal = true
        this.onlyVertices = false
        this.customAttributes = []
        this.node = new Node()

        this.isHidden = false

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
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos");

        if (!this.onlyVertices) {
            shaderProgram.vertexUvAttribute = gl.getAttribLocation(shaderProgram, "aUvs");
        }

        if (this.hasNormal) {            
            shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
        }

        // Custom attibutes
        this.customAttributes.forEach(attr => {
            shaderProgram[ attr.name + "Attribute"] = gl.getAttribLocation(shaderProgram, attr.attributeName);
            // gl.enableVertexAttribArray(shaderProgram[attr.name + "Attribute"])
        })
        
        this.vertShader = vertShader
        this.fragSahder = fragSahder
        this.program = shaderProgram

        const numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
        for (let ii = 0; ii < numAttribs; ++ii) {
            const attribInfo = gl.getActiveAttrib(shaderProgram, ii);
            const index = gl.getAttribLocation(shaderProgram, attribInfo.name);
        }

    }

    initVao() {

        let gl = this.gl

        this.vao = gl.createVertexArray()

        gl.bindVertexArray(this.vao)

        gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer)
        gl.vertexAttribPointer(this.program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

        if (!this.onlyVertices) {
            gl.enableVertexAttribArray(this.program.vertexUvAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
            gl.vertexAttribPointer(this.program.vertexUvAttribute, 2, gl.FLOAT, false, 0, 0)
        }

        if (this.hasNormal) {
            gl.enableVertexAttribArray(this.program.vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
            gl.vertexAttribPointer(this.program.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)
        }

        for (let i = 0; i < this.customAttributes.length; i++) {
            const attr = this.customAttributes[i]
            gl.enableVertexAttribArray(this.program[attr.name + "Attribute"])
            gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
            gl.vertexAttribPointer(this.program[attr.name + "Attribute"], attr.dimensions, gl.FLOAT, false, 0, 0)
        }

        if (!this.onlyVertices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
        }

        gl.bindVertexArray(null)

    }

    initBuffer(geom) {

        let gl = this.gl

        let vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.vertices), gl.STATIC_DRAW)


        let normalBuffer = gl.createBuffer();
        if (this.hasNormal) {
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.normal), gl.STATIC_DRAW)
        }


        let uvsBuffer = gl.createBuffer();
        let indicesBuffer = gl.createBuffer();
        if (!this.onlyVertices) {
            gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.uvs), gl.STATIC_DRAW)

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geom.indices), gl.STATIC_DRAW)
        }

        this.customAttributes.forEach(attr => {
            attr.buffer = gl.createBuffer()            
            gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attr.data), gl.STATIC_DRAW)
        })

        this.vertexPositionBuffer = vertexPositionBuffer
        this.uvsBuffer = uvsBuffer
        if (this.hasNormal) {
            this.normalBuffer = normalBuffer
        }
    
        this.indicesBuffer = indicesBuffer

    }

    initMatrix(){
        this.createUniform("uPMatrix", "mat4")
        this.createUniform("uVMatrix", "mat4")
        this.createUniform("uMMatrix", "mat4")
    }

    bindMatrixUniforms(camera) {
        this.bindUniform("uPMatrix", camera.getProjectionMatrix())
        this.bindUniform("uVMatrix", camera.getViewMatrix())
        this.bindUniform("uMMatrix", this.node.getMatrix())
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

    createAttribute(name, attributeName, dimensions, data){
        this.customAttributes.push({ name, attributeName, dimensions, buffer: null, data })
    }

    bindUniform(name, value){
        let gl = this.gl
        if (this.uniforms[name + "Uniform"].type == "texture"){
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

    checkVisibility(){
        return this.isHidden
    }
}

export default Rendable