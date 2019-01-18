import when from 'when'

class TextureLoader {

    constructor() {
        this.textures = {}
        this.currentUnit = 0
    }

    init(scene) {
        this.scene = scene
        this.gl = scene.gl
    }

    load(url, id, options) {
        let image = new Image()
        image.crossOrigin = "anonymous";
        image.onload = () => {
            let texture = this.initTexture(image, options)
            this.textures[id].texture = texture
            this.textures[id].unit = this.currentUnit
            this.currentUnit++
            this.textures[id].defer.resolve(texture)
        }
        image.src = url
        this.textures[id] = {
            img: image,
            defer: when.defer()
        }
        return this.textures[id].defer.promise
    }

    initTexture(image, options) {
        let gl = this.gl
        // create
        let texture = gl.createTexture();

        // bind it to operate on it
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

        const w = image.width
        const h = image.height
        let wrap = gl.CLAMP_TO_EDGE
        if (w == h && (w && (w & (w - 1)) === 0)) {
            wrap = gl.REPEAT
        } else if (options.indexOf("mirror") > -1) {
            wrap = gl.MIRRORED_REPEAT
        }

        // Set the filter wrapping and filter parameters.
        // gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

        return texture
    }

    getTexture(id) {
        if (this.textures[id].texture) {
            return this.textures[id].texture
        }
    }

    getImage(id) {
        if (this.textures[id].texture) {
            return this.textures[id].img
        }
        return null
    }

}
const out = new TextureLoader()
export default out