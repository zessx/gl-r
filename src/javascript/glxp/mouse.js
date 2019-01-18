import glmat from 'gl-matrix'
import STORE from '../store'
import normalizeWheel from 'normalize-wheel'
import Emitter from 'event-emitter'
import Bowser from 'bowser'
import RAF from '../utils/raf'

const SCROLL_SPEED = 0.00001

let vec2 = glmat.vec2

class Mouse {

    constructor() {
        this.cursor = vec2.fromValues(-1, -1)
        this.scroll = 0
        this.isDown = false
        this.isWaitting = true
        this.everScrolled = false
        this.preventScroll = false
        this.timer = setTimeout(() => { }, 0)
        this.deltaScroll = 0

        this.lastTouchY = 0
        this.initEvents()

        this.emitter = {}
        Emitter(this.emitter)
        this.on = this.emitter.on.bind(this.emitter)

        RAF.suscribe("mouse", () => {
            this.deltaScroll -= 10
            this.deltaScroll = Math.max(this.deltaScroll, 0)
        })

        if (Bowser.mobile == true || Bowser.tablet == true) {
            this.cursor = vec2.fromValues(0, 0)
        }
    }

    initEvents() {

        if (Bowser.mobile == true || Bowser.tablet == true) {
            window.addEventListener("touchstart", (event) => {
                this.lastTouchY = event.touches[0].clientY
            })


            window.addEventListener("touchmove", (event) => {
                let tmp = event.touches[0].clientY - this.lastTouchY
                this.lastTouchY = event.touches[0].clientY
                this.deltaScroll = tmp
                this.emitter.emit('scroll', tmp * -7.5)
                if (this.preventScroll) {
                    return
                }
                this.scroll += tmp * SCROLL_SPEED * -7.5
                this.scroll = Math.max(Math.min(this.scroll, 1), 0)
                this.resetTimeClock()
                if (!this.everScrolled) {
                    this.everScrolled = true
                    this.emitter.emit('firstScroll')
                }
            })
        } else {
            window.addEventListener("mousemove", (event) => {
                this.cursor[0] = (event.clientX / STORE.screenWidth - .5) * 2
                this.cursor[1] = (event.clientY / STORE.screenHeight - .5) * 2
                // this.resetTimeClock()
            })

            const onWheel = (event) => {
                let normalized = normalizeWheel(event)
                let tmp = Math.min(Math.max(normalized.pixelY, -70), 70)
                this.emitter.emit('scroll', tmp)
                if (this.preventScroll) {
                    return
                }
                this.deltaScroll = tmp
                this.scroll += tmp * SCROLL_SPEED
                this.scroll = Math.max(Math.min(this.scroll, 1), 0)
                this.resetTimeClock()
                if (!this.everScrolled) {
                    this.everScrolled = true
                    this.emitter.emit('firstScroll')
                }
            }

            document.addEventListener('mousewheel', (event) => {
                onWheel(event)
            })
            document.addEventListener('DOMMouseScroll', (event) => {
                onWheel(event)
            })
            window.addEventListener("mousedown", () => {
                this.isDown = true
            })
            window.addEventListener("mouseup", () => {
                this.isDown = false
            })
            window.addEventListener("click", () => {
                this.emitter.emit('click')
            })
            
        }

    }

    resetTimeClock() {
        this.isWaitting = false
        this.emitter.emit('active')
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.isWaitting = true
            this.emitter.emit('waitting')
        }, 4000)
    }

    forceWaitting() {
        this.isWaitting = false
        this.emitter.emit('active')
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.isWaitting = true
            this.emitter.emit('waitting')
        }, 100)
    }

    resetSroll() {
        this.scroll = 0
    }


}

const out = new Mouse()
export default out
