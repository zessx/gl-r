class FBO {

    constructor(scene, pixelRatio = 1) {

        this.scene      = scene
        this.gl         = scene.gl
        this.pixelRatio = pixelRatio

        this.width      = this.scene.width * this.pixelRatio
        this.heigth     = this.scene.height * this.pixelRatio

        this.createTexture()
        this.createFB()

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)

    }

    createTexture() {

        this.targetTexture = this.gl.createTexture()

        let gl = this.gl

        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture)

        const level = 0
        const internalFormat = gl.RGBA
        const border = 0
        const format = gl.RGBA
        const type = gl.UNSIGNED_BYTE
        const data = null

        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, this.width, this.heigth, border, format, type, data)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    }

    createFB() {

        let gl = this.gl
        this.fb = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)

        
        const level = 0
        const attachmentPoint = gl.COLOR_ATTACHMENT0
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.targetTexture, level)

        // create a depth renderbuffer
        const depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

        // make a depth buffer and the same size as the targetTexture
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.heigth);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    }

    preRender(){
        let gl = this.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        gl.viewport(0, 0, this.width, this.heigth);
        gl.clearColor(0.53, 0.4, 0.21, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }

    postRender() {
        let gl = this.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    bind() {
        let gl = this.gl
        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture)
    }

    getTexture() {
        return this.targetTexture
    }

}

export default FBO