import glmat from 'gl-matrix'

let mat4 = glmat.mat4
let quat = glmat.quat
let vec3 = glmat.vec3

class Node {
    constructor() {
        this.parent = null
        this.children = []
        this.mesh = null

        this.position = vec3.fromValues(0, -.8, 0)
        this.scale = vec3.fromValues(1, 1, 1)
        this.rotation = vec3.fromValues(0, 0, 0)
        this.quaternion = quat.create()
        this.matrix = mat4.create()

        this.needUpdate = true
        this.forceUpdate = false

        return this
    }

    setPosition(x, y, z) {
        this.needUpdate = true
        this.position[0] = x
        this.position[1] = y
        this.position[2] = z
    }

    setRotation(x, y, z) {
        this.needUpdate = true
        this.rotation[0] = x
        this.rotation[1] = y
        this.rotation[2] = z
    }

    setScale(x, y, z) {
        this.needUpdate = true
        this.scale[0] = x
        this.scale[1] = y
        this.scale[2] = z
    }

    lookAt(tgt, camera) {
        this.needUpdate = true
        this.getMatrix()
        mat4.lookAt(this.matrix, camera.node.position, tgt, [0, 1, 0])
    }

    getMatrix() {
        if (!this.needUpdate && !this.forceUpdate) {
            return this.matrix
        }
        mat4.identity(this.matrix)
        this.quaternion = quat.create()
        quat.rotateX(this.quaternion, this.quaternion, this.rotation[0])
        quat.rotateY(this.quaternion, this.quaternion, this.rotation[1])
        quat.rotateZ(this.quaternion, this.quaternion, this.rotation[2])
        mat4.fromRotationTranslationScale(this.matrix, this.quaternion, this.position, this.scale)
        if (this.parent !== null) {
            mat4.mul(this.matrix, this.parent.getMatrix(), this.matrix)
        }
        this.needUpdate = false
        return this.matrix
    }

    getChildByName(n) {
        for (let i = 0; i < this.children.length; i++) {
            const element = this.children[i];
            if (element.name && element.name == n) {
                return element
            }
        }
    }

    // getParentsMatrix() {
    //     if (this.parent == null) {
    //         return null
    //     }
    //     let tmp = mat4.create()
    //     let p = this.getParentsMatrix()
    //     if (p !== null) {
    //         mat4.add(tmp, this.parent.getMatrix())
    //     }
    //     return tmp
    // }

    addChildNode(node) {
        this.children.push(node)
        node.parent = this
    }

    fromPositionRotationScale(p, r, s) {
        this.position = vec3.clone(p)
        this.scale = vec3.clone(s)
        this.rotation = vec3.clone(r)
        return this
    }

}

export default Node