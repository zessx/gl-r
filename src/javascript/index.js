import * as TOOLS   from './glxp/tools.class.js'
import RAF          from './utils/raf'
import STORE        from './store'
import Scene        from './glxp/scene'
import App          from './vue'
import Cursor       from './utils/cursor'
import Content      from '../content/content'


// const framecounter = new TOOLS.FrameRateUI()
// RAF.suscribe('fps', framecounter.update.bind(framecounter))

STORE.projects = []
Content.forEach(element => {
    STORE.projects.push(element.slug)
})
RAF.suscribe('scene', Scene.render.bind(Scene))

Scene.load()

window.addEventListener('resize', ()=>{
    STORE.screenWidth = window.innerWidth
    STORE.screenHeight = window.innerHeight
})
