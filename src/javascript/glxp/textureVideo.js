import when from 'when'
import RAF from '../utils/raf'

class TextureVideo {

    constructor(scene, url, autoplay = true) {
        this.scene    = scene
        this.gl       = scene.gl
        this.url      = url
        this.texture  = null
        this.video    = null
        this.canPlay  = false
        this.texture  = null
        this.autoplay = autoplay
        this.defer    = when.defer()
        this.lastPass = Date.now()
        this.width    = 1
        this.height   = 1

        this.framerate = 1 / 30

        this.initTexture()
        this.setSource()
    }
    
    getPromise(){
        return this.defer.promise
    }

    setSource() {

        const video = document.createElement('video')

        this.video = video

        var playing = false;
        var timeupdate = false;

        video.autoplay = this.autoplay;
        video.muted = true;
        video.volume = 0
        video.loop = true;

        // Waiting for these 2 events ensures
        // there is data in the video

        video.addEventListener('playing', () => {
            playing = true
            checkReady()
        }, true)

        video.addEventListener('timeupdate', () => {
            timeupdate = true;
            checkReady()
        }, true)

        video.src = this.url
        video.play()

        const checkReady = () => {
            if (playing && timeupdate && this.canPlay === false) {
                this.canPlay = true
                this.defer.resolve()
                this.width = video.videoWidth
                this.height = video.videoHeight
                video.pause()
            }
        }

    }

    play() {
        this.video.play(0)
    }

    pause() {
        this.video.pause()
    }

    initTexture() {
        let gl = this.gl
        // create
        let texture = gl.createTexture();

        // bind it to operate on it
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0
        const internalFormat = gl.RGBA
        const border = 0
        const format = gl.RGBA
        const type = gl.UNSIGNED_BYTE
        const width = 1;
        const height = 1;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue

        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, pixel)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

        this.texture = texture

    }

    getTexture() {
        return this.texture
    }

    update() {
        if ((Date.now() - this.lastPass) < (this.framerate * 1000)) {
            return
        }
        this.lastPass = Date.now()
        if (this.canPlay) {
            let gl = this.gl
            const level = 0
            const internalFormat = gl.RGBA
            const srcFormat = gl.RGBA
            const srcType = gl.UNSIGNED_BYTE
            gl.bindTexture(gl.TEXTURE_2D, this.texture)
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, this.video)
        }
    }

}

export default TextureVideo