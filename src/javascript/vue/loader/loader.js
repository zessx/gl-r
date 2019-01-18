
import template from "./loader.template"

export default {
    name: "loader-section",
    template: template,
    data: function () {
        return {
            visible: true,
            progress: 0
        }
    },

    mounted: function () {
        
        GLXP.on('progress', (progress) => {
            this.progress = progress
        })

        GLXP.on('loaded', ()=>{
            setTimeout(() => {
                this.visible = false
            }, 200)
        })
    },

    methods: {

    }
}
