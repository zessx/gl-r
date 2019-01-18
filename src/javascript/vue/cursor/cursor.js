
import template from "./cursor.template"
import CursorController from "../../utils/cursor"
import RAF from "../../utils/raf"
import Mouse from '../../glxp/mouse'
import STORE from "../../store"
import Bowser from 'bowser'

export default {
    name: "ui-cursor",
    template: template,
    data: function () {
        return {
            visible: false,
            playing: false,
            hover: false,
        }
    },

    mounted: function () {

        STORE.cursor = this

        this.cursor = new CursorController(this)
        RAF.suscribe('cursor', this.cursor.update.bind(this.cursor))
        

        GLXP.on('loaded', () => {
            if (Bowser.mobile == true) {
                setTimeout(() => {
                    this.show()
                }, 5800)
            } else if (Bowser.tablet) {
            } else {
              setTimeout(() => {
                  this.show()
              }, 500)
            }
        })

        GLXP.on('planeHovered', (id)=>{
            if (id !== null) {
                this.cursor.hover = true
            } else {
                this.cursor.hover = false
            }
        })

        GLXP.on('planeSelected', (index) => {
            this.cursor.hover = false
            this.showLabel()
        })

        STORE.cursor = this

        if (Bowser.mobile == true || Bowser.tablet == true) {
            this.hide()
        }

        this.hideLabel()

    },

    methods: {
        
        show(){
            document.querySelector("html").classList.add('no-cursor')
            this.visible = true
        },

        hide(){
            document.querySelector("html").classList.remove('no-cursor')
            this.visible = false
        },

        showLabel() {
            this.cursor.hideLabel = false
        },

        hideLabel() {
            this.cursor.hideLabel = true
        },

        prevent(){
            this.cursor.prevent = true
        },

        activate(){
            this.cursor.prevent = false
        }
    }
}
