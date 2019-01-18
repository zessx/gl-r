import TextureVideo from './textureVideo'

class VideoTextureManager {
    constructor(){
        this.textures = {}
        this.videos = []
        this.activeVideo = -1
        this.activeVideos = [null, null]
    }

    init(scene) {
        this.scene = scene
        this.gl = scene.gl
    }

    load(url, id){
        this.videos.push(id)
        this.textures[id] = new TextureVideo(this.scene, url)
        return this.textures[id].getPromise()
    }

    activeSlot(id, index){
        this.activeVideos[index] = id
        if (index == 0) { this.activeVideo = id }
        if (this.activeVideos[index] !== null) {
            this.textures[id].pause()
        }
        if (this.textures[id].texture) {
            return this.textures[id].play()
        }
    }

    getSlot(index){
        return this.get(this.activeVideos[index])
    }

    get(id) {
        if (this.textures[id].texture) {
            return this.textures[id]
        }
    }

    next(){
        this.activeSlot(this.activeVideos[1], 0)
        this.scene._emitter.emit('nextEnd', this.activeVideo)
        let nextIndex = this.videos.indexOf(this.activeVideo) + 1
        nextIndex = nextIndex > this.videos.length - 1 ? 0 : nextIndex
        this.activeSlot(this.videos[nextIndex], 1)
    }

    updateSlot(index){
        if (this.activeVideos[index] !== null) {
            this.textures[this.activeVideos[index]].update()
        }
    }
}

const out = new VideoTextureManager()
export default out