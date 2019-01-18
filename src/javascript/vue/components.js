import loader from './loader/loader'
import cursor  from './cursor/cursor'
import mainOverlay  from './main-overlay/main-overlay'

import Mixin from './mixin'
import Vue from 'vue/dist/vue.js'

[
    loader,
    cursor,
    mainOverlay,
]
.map(component => {
    component.mixins = [Mixin]
    Vue.component(component.name, component)
})
