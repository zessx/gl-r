import TextureLoader from '../textureLoader'
import Emitter from 'event-emitter'
import VideoTextureManager from '../videoTextureManager'
import Node from '../node'

class Scene {

    constructor() {

        this.dpr = window.devicePixelRatio
        this.width = window.innerWidth * this.dpr
        this.height = window.innerHeight * this.dpr

        this.active = false
        this.everTit = false
        this.time = 0
        this.dt = 0
        this.sceneModels = []

        this.canvas = document.createElement('canvas')
        this.container = document.querySelector('#container')

        this.catchContext()
        TextureLoader.init(this)
        VideoTextureManager.init(this)

        this.root = new Node()

        window.GLXP = this
        this._emitter = {}
        Emitter(this._emitter)
        this.on = this._emitter.on.bind(this._emitter)

        window.addEventListener('resize', this.onResize.bind(this))

    }

    catchContext() {

        this.container.appendChild(this.canvas)
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.maxWidth = window.innerWidth + "px"
        this.canvas.style.maxHeight = window.innerHeight + "px"

        this.gl = this.canvas.getContext('webgl', {
            antialias: false
        })
        if (this.gl == undefined) { return }

        // enable extensions

        // VAO Polyfill
        let vaoExt = this.gl.getExtension('OES_vertex_array_object');
        if (vaoExt) {
            this.gl['createVertexArray'] = function () { return vaoExt['createVertexArrayOES'](); };
            this.gl['deleteVertexArray'] = function (vao) { vaoExt['deleteVertexArrayOES'](vao); };
            this.gl['bindVertexArray'] = function (vao) { vaoExt['bindVertexArrayOES'](vao); };
            this.gl['isVertexArray'] = function (vao) { return vaoExt['isVertexArrayOES'](vao); };
        }
        this.gl.getExtension('OES_standard_derivatives');
        this.gl.getExtension('EXT_shader_texture_lod');


    }

    onResize() {
        this.width = window.innerWidth * this.dpr
        this.height = window.innerHeight * this.dpr
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.maxWidth = window.innerWidth + "px"
        this.canvas.style.maxHeight = window.innerHeight + "px"
        this.gl.viewport(0, 0, this.width, this.height)
    }

    findMeshByName(name){
        this.meshes.forEach(element => {
            if (element.name == name){
                return element
            }
        })
    }

}

export default Scene