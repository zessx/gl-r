// import bowser from 'bowser'
import Mouse from '../glxp/mouse'
import Bowser from 'bowser'
import TextureLoader from '../glxp/textureLoader'
import RAF from '../utils/raf'

class Cursor {

    constructor(view) {

        this.vue = view
        this.view = view.$el
        this.screenWidth = window.innerWidth
        this.screenHeigth = window.innerHeight

        this.isMobile = Bowser.mobile || Bowser.tablet

        this.dpr = window.devicePixelRatio
        this.width = 90
        this.height = 90
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.x = 0
        this.y = 0

        this.canvas.width = this.width * this.dpr
        this.canvas.height = this.height * this.dpr
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'
        this.canvas.classList.add('cursor')


        view.$el.appendChild(this.canvas)

        this.progress           = 0
        this.scale              = 1
        this.target             = 1
        this.playOpacity        = 1
        this.damping            = .06
        this.labelOpacity       = 1
        this.introLabelOpacity  = 0

        this.listenHold   = false
        this.active       = false
        this.prevent      = false
        this.hideLabel    = false
        this.hover        = false

        this.time         = 0

        // if (bowser.mobile) {
        //     this.canvas.style.display = "none"
        // }

        window.addEventListener("resize", () => {
            this.resize()
        })

    }

    resize() {
        this.screenWidth = window.innerWidth
        this.screenHeigth = window.innerHeight
    }

    ready() {
        this.listenHold = true
    }

    activate() {
        this.active = true
        document.body.classList.add('noCursor')
    }

    playAnimation() {
        this.vue.showArrow()
    }

    resize() {
        this.screenWidth = window.innerWidth
        this.screenHeigth = window.innerHeight
    }

    draw() {
        let ctx = this.ctx
        ctx.clearRect(0, 0, this.width * this.dpr, this.height * this.dpr)

        // Mouse cursor
        // ctx.beginPath()
        // ctx.fillStyle = 'rgba(38, 38, 38, 1)'
        // ctx.lineWidth = 2
        // ctx.arc(45 * this.dpr, 45 * this.dpr, (10 + (15 * Math.easing.easeInOutCubic(this.scale))) * this.dpr, 0, 2 * Math.PI)
        // ctx.fill()
    }

    update() {

        if (this.isMobile == true || GLXP.active == false) {
            return
        }

        // if (bowser.mobile) { return }

        this.time += RAF.dt

        let tmp = this.target - this.scale
        tmp *= this.damping
        this.scale += tmp

        this.x = ((Mouse.cursor[0] + 1) * .5 * this.screenWidth) - this.width / 2
        this.y = ((Mouse.cursor[1] + 1) * .5 * this.screenHeigth) - this.height / 2

        if (Mouse.isDown && !this.prevent) {
            this.progress += .01
            this.target = .75
            this.damping = .01
        } else if (this.prevent){
            this.progress -= .02
            this.target = 0
            this.damping = .06
        } else if (this.hover) {
            this.progress += .09
            this.target = .1
            this.damping = .05
        } else {
            this.progress -= .02
            this.target = .4
            this.damping = .06
        }

        this.scale = Math.min(Math.max(this.scale, 0), 1)
        this.progress = Math.min(Math.max(this.progress, 0), 1)

        this.view.style.transform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, 0)'
        this.draw()

    }

}

export default Cursor
