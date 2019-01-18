import glmat from 'gl-matrix'
import Node from './node'

let vec3 = glmat.vec3
let mat4 = glmat.mat4
let quat = glmat.quat

class Camera {
    constructor(scene, fov) {

        this.scene = scene
        this.gl = scene.gl
        this.fov = fov
        this.pMatrix = mat4.create()
        this.node = new Node()
        this.position = this.node.position
        this.rotation = this.node.rotation
        this.node.forceUpdate = true

    }

    updatePositionMatrix() {
        let gl = this.gl
        mat4.identity(this.node.getMatrix())
        this.quaternion = quat.create()
        quat.rotateX(this.quaternion, this.quaternion, this.rotation[0])
        quat.rotateY(this.quaternion, this.quaternion, this.rotation[1])
        quat.rotateZ(this.quaternion, this.quaternion, this.rotation[2])
        mat4.fromRotationTranslationScale(this.node.getMatrix(), this.quaternion, this.position, [1, 1, 1])
    }

    lookAt(tgt) {
        mat4.lookAt(this.node.getMatrix(), this.node.position, tgt, [0, 1, 0])
        this.node.needUpdate = true
        this.node.getMatrix()
    }

    getProjectionMatrix() {
        return this.pMatrix
    }

    getViewMatrix() {
        return this.node.getMatrix()
    }

    updateProjection(ratio) {
        mat4.perspective(this.pMatrix, this.fov * Math.PI / 180, ratio, 0.1, 10000.0)
    }

    update(ratio) {
        this.updatePositionMatrix()
        this.updateProjection(ratio)
    }
}

export default Camera