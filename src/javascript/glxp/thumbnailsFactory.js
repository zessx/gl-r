import Plane from './plane'
import Data from '../data'

// let mesh = new Plane(this, objs[0])
// mesh.node.setScale(3)
// this.meshes.push(mesh)
// this.root.addChildNode(mesh.node)

class ThumbnailsFactory {
    constructor(scene){
        this.scene = scene
        this.gl = scene.gl
        this.children = []
    }

    setSource(obj){
        this.obj = obj
    }

    populate(){

        const data = Data.get()
        for (let i = 0; i < data.length; i++) {
            const im = data[i].Thumb.path
            let mesh = new Plane(this.scene, this.obj, im, i)
            this.scene.meshes.push(mesh)
            this.scene.root.addChildNode(mesh.node)
            mesh.node.setPosition((Math.random() -.5) * 5, i * 2.5, i%2)
        }
    }

}

export default ThumbnailsFactory