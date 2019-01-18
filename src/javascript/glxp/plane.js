
import Rendable from './rendable'
import glmat from 'gl-matrix'
import TextureLoader from "./textureLoader"
import Node from "./node"
// import VideoTextureManager from "../videoTextureManager"

let vec3 = glmat.vec3
let mat4 = glmat.mat4
let vec2 = glmat.vec2

class Plane extends Rendable {
    constructor(scene, geom, img, id) {

        super(scene)
        this.geom = geom    
        this.img = img
        this.id = id
        
        this.node = new Node()

        this.initBuffer({
            vertices: this.geom.vertices,
            uvs: this.geom.uvs,
            normal: this.geom.normal,
            indices: this.geom.indices,
        })
        this.initProgram(
            require('../../shaders/plane/plane.vert'),
            require('../../shaders/plane/plane.frag')
        )
        this.initMatrix()
        this.initVao()
        this.createUniforms()

        this.timeOffset = Math.random() * 100
        this.height  = 0
        this.hover   = false
        this.mixMatrix = 1

        this.hoverTimeOffset = 0
        this.hoverTimeOffsetTarget = 0

        this.node.setScale(1.5)
        this.srcImg = TextureLoader.getImage(this.img)
        this.srcImgDim = [this.srcImg.width, this.srcImg.height]
        this.node.scale[0] *= this.srcImgDim[0] / this.srcImgDim[1]

        this.pickColor = vec3.fromValues(((this.id + 1) * 3) / 255, ((this.id + 1) * 3) / 255, ((this.id + 1) * 3) / 255)

        this.MVP = mat4.create()
        this.iMatrix = mat4.create()

        this.isValid = true

    }

    initMatrix() {
        this.createUniform("uMVPMatrix", "mat4")
    }

    bindMatrixUniforms(camera) {
        if (this.isValid === true) { return }
        mat4.mul(this.MVP, camera.getProjectionMatrix(), camera.getViewMatrix())
        mat4.mul(this.MVP, this.MVP, this.node.getMatrix())
        this.bindUniform("uMVPMatrix", this.MVP)
        this.isValid = true
    }

    createUniforms() {
        this.createUniform("uTexture",      "texture")
        this.createUniform("uProjectPic",   "texture")
        this.createUniform("uImgSize",      "float2")
        this.createUniform("uPlaneScale",   "float2")
        this.createUniform("uIdColor",      "float3")
        this.createUniform("uIsColorPass")
        this.createUniform("uTime")
        this.createUniform("uMix")
        this.createUniform("uHeight")
    }

    applyState() {
        let gl = this.gl
        this.scene.applyDefaultState()
        // gl.disable(gl.DEPTH_TEST)
    }

    preRender(){
        if (this.hover) {
            this.height += 0.01
        }
    }

    focus(){
        TweenMax.to(this, .5, {
            mixMatrix: 0,
            ease: Expo.easeOut,
            onComplete: () => {
                this.scene.showHome(this.id, this.img)
            }
        })
    }

    onHover(){
        this.hoverTimeOffsetTarget += .8
        TweenMax.to(this, 2, {
            hoverTimeOffset: this.hoverTimeOffsetTarget,
            ease: Power2.easeOut,
        })
    }

    render(mask) {

        this.preRender()

        let gl = this.gl

        // this.node.rotation[1] += this.scene.dt * - 0.02
        // this.node.position[1] += this.scene.dt * 0.4
        this.node.needUpdate = true

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)
        this.applyState()

        this.bindMatrixUniforms(this.scene.camera)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, TextureLoader.getTexture("noise"))
        this.bindUniform("uTexture", 0)

        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, TextureLoader.getTexture(this.img))
        this.bindUniform("uProjectPic", 1)

        this.bindUniform("uTime", this.scene.time + this.timeOffset + this.hoverTimeOffset)
        this.bindUniform("uHeight", this.height)
        this.bindUniform("uMix", this.mixMatrix)

        this.bindUniform("uImgSize", this.srcImgDim)

        let tmp = vec2.create()
        vec2.lerp(tmp, [this.scene.width, this.scene.height], [this.node.scale[0] * this.scene.width, this.node.scale[1] * this.scene.width], this.mixMatrix)
        this.bindUniform("uPlaneScale", tmp)

        this.bindUniform("uIdColor", this.pickColor)
        if (mask === true) {
            this.bindUniform("uIsColorPass", 1)
        } else {
            this.bindUniform("uIsColorPass", 0)
        }

        gl.drawElements(gl.TRIANGLES, this.geom.indices.length, gl.UNSIGNED_SHORT, 0)
        gl.bindVertexArray(null)

    }

}

export default Plane