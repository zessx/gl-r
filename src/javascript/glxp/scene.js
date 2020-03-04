// Libs
import when from 'when'
import Emitter from 'event-emitter'

// Strcutral
import SceneAbs from './abstract/scene'
import Manifest from '../manifest'
import Camera from './camera'
import TextureLoader from './textureLoader'
// import VideoTextureManager from './videoTextureManager'
import Node from './node'

// Entities
import RBack from './entities/RBack'
import RSun from './entities/RSun'
import RRoad from './entities/RRoad'
import RLetter from './entities/RLetter'
import RLetterShadow from './entities/RLetterShadow'

// Components
import OrbitControl from './orbitControl'

// Controller
import Mouse from './mouse'

// Libs
import glmat from 'gl-matrix'

// Utils
import RAF from '../utils/raf'
import ModelLoader from './loader/binaryLoader'
// import AnimLoader from './loader/animationLoader'
import { TweenMax } from 'gsap'



let mat4 = glmat.mat4
let quat = glmat.quat
let vec3 = glmat.vec3

var _emitter = {}
Emitter(_emitter)

class Scene extends SceneAbs {

    constructor() {

        super()

        this.cameraPositionTarget = vec3.fromValues(0, 0, -10)
        this.cameraDirection = vec3.create()
        this.cameraPosition = vec3.create()
        this.tiltOffset = [0, 0]
        this.animations = {}

        this.camera = new Camera(this, 30)
        // this.orbit = new OrbitControl(this)
        // this.trackball              = new TrackballControl(this)
        // this.trackball.start(this.camera)

        // Entities
        this.rBack = new RBack(this)
        this.rSun = new RSun(this)
        this.rRoad = new RRoad(this)
        this.rLetter = new RLetter(this)
        this.rLetterShadow = new RLetterShadow(this)

        // Post Process
        // this.dof                    = new Dof(this)

        this.meshes = []
        this.tiltOffset = [0, 0]


        // this.root.rotation[1] = Math.PI
        // this.root.scale = vec3.fromValues(0.01, 0.01, 0.01)


    }

    start() {

    }

    onLoaded() {
        this.active = true
        this._emitter.emit('loaded')
    }



    load() {

        let loadables = []
        for (const key in Manifest.images) {
            if (Manifest.images.hasOwnProperty(key)) {
                const element = Manifest.images[key].url;
                loadables.push(TextureLoader.load(element, key, Manifest.images[key].options))
            }
        }

        for (const key in Manifest.videos) {
            if (Manifest.videos.hasOwnProperty(key)) {
                const element = Manifest.videos[key];
                loadables.push(VideoTextureManager.load(element, key, false))
            }
        }


        // loadables.push(new ModelLoader("assets/models/scene.json", "assets/models/scene.bin").then((objs) => {
        //     let crystals = []
        //     this.orbPath = []
        //     objs.forEach(geom => {
        //         if (geom.type == "Null") {
        //             let node = new Node().fromPositionRotationScale(geom.translate, geom.rotation, geom.scale)
        //             node.name = geom.name
        //             this.root.addChildNode(node)
        //         } else {
        //             if (geom.name == "Landscape") {
        //                 let mesh = new Floor(this, geom, "floor")
        //                 this.meshes.push(mesh)
        //                 this.root.addChildNode(mesh.node)
        //             } else if (geom.name == "Forest") {
        //                 let mesh = new Floor(this, geom, "trees")
        //                 this.meshes.push(mesh)
        //                 this.root.addChildNode(mesh.node)
        //             } else if (geom.name == "Landscape_Shadow") {
        //                 let mesh = new Floor(this, geom, "animatedTextures", true)
        //                 this.meshes.push(mesh)
        //                 this.root.addChildNode(mesh.node)
        //             } else if (geom.name == "Gem") {
        //                 let mesh = new Crystal(this, geom)
        //                 mesh.node = new Node().fromPositionRotationScale(geom.translate, geom.rotation, geom.scale)
        //                 this.meshes.push(mesh)
        //                 this.root.addChildNode(mesh.node)
        //                 this.snow.node.position = vec3.clone(mesh.node.position)
        //             } else if (geom.name == "Swirl") {
        //                 let mesh = new Swirl(this, geom)
        //                 mesh.node = new Node().fromPositionRotationScale(geom.translate, geom.rotation, geom.scale)
        //                 this.meshes.push(mesh)
        //                 this.root.addChildNode(mesh.node)
        //                 this.swirl = mesh
        //             } else if (geom.name == "Flare") {
        //                 let mesh = new Flare(this, geom)
        //                 this.meshes.push(mesh)
        //                 this.root.addChildNode(mesh.node)
        //             } else if (geom.name == "OrbPath") {
        //                 this.orbPath.push(geom.vertices)
        //             } else if (geom.name == "Orb") {
        //                 let mesh = new Orb(this, geom)
        //                 this.meshes.push(mesh)
        //                 this.root.addChildNode(mesh.node)
        //                 this.orb = mesh
        //             }
        //         }
        //     })
        // }))


        when.all(loadables).then(() => {
            this.onLoaded()
        })

        let percent = 0
        for (let i = 0; i < loadables.length; i++) {
            loadables[i].then(() => {
                percent++
                this._emitter.emit('progress', Math.round((percent / loadables.length) * 100))
            })
        }
    }

    applyDefaultState() {
        let gl = this.gl
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND)
        gl.enable(gl.DEPTH_TEST)
        gl.disable(gl.CULL_FACE)
    }

    // Pre-render
    preRender() {

        let gl = this.gl

        this.camera.updateProjection(this.width / this.height)

        // this.cameraPositionTarget[0] = Mouse.cursor[0] * .35 + this.tiltOffset[0]
        // this.cameraPositionTarget[1] = Mouse.cursor[1] * .1 + this.tiltOffset[1]

        vec3.sub(this.cameraDirection, this.cameraPositionTarget, this.cameraPosition)
        vec3.scale(this.cameraDirection, this.cameraDirection, .04)
        vec3.add(this.cameraPosition, this.cameraPosition, this.cameraDirection)

        this.camera.node.position[0] = this.cameraPosition[0]
        this.camera.node.position[1] = -this.cameraPosition[1]
        this.camera.node.position[2] = this.cameraPosition[2]

    }

    // Render
    render() {

        if (!this.active) { return }
        this.time += RAF.dt / 1000
        this.dt = RAF.dt

        let gl = this.gl

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.colorMask(true, true, true, true)

        this.preRender()
        gl.viewport(0, 0, this.width, this.height)

        // Render Time
        this.rBack.render();
        this.rSun.render();
        this.rRoad.render();
        this.rLetterShadow.render();
        this.rLetter.render();

        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].render()
        }

        this.postRender()


    }

    postRender() {

        this.gl.viewport(0, 0, this.width, this.height)

    }

}
const out = new Scene()
export default out
