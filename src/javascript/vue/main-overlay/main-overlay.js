
import template from "./main-overlay.template"
import Bowser from 'bowser'
import STORE from "../../store"
import RAF from '../../utils/raf'
// import Smooth from 'smooth-scrolling'

let mobile = Bowser.mobile ? true : false
let canShowIntro = true 
let canHideIntro = false 

const scrollInfos = {
    height: 0,
    current: 0,
    elementsNum: 0
}

export default {
    name: "main-overlay-section",
    template: template,
    data: function () {
        return {
            visible: false,
            logoVisible: false,
            data: []
        }
    },

    mounted: function () {

        STORE.mainOverLay = this

        GLXP.on('loaded', () => {
            this.visible = true
            
            // this.enableScroll()
        })

        if (mobile == true) {
            
        }

    },

    methods: {


        hideIntro(){
            if (!canHideIntro) {
                return
            }
            canHideIntro = false
            canShowIntro = true
        },

    }
}
