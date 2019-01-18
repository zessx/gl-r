const EN = require("../../locales/EN.json")

const locales = {
    'en-US': JSON.stringify(EN),
}
let defaultLang = 'en-US'

let language = require('browser-locale')()
if (language == undefined) {
    language = 'en-US'
}

let supported = false
for (const key in locales) {
    if (locales.hasOwnProperty(key) && key === language) {
        supported = true
    }
}

const Mixin  = {
  methods: {
    trad: function (key) {
        if (supported) {
            return locales[language][key]
        } else {
            return locales[defaultLang][key]
        }
    },

    spanify(text, delay = true) {
        let t = text.split(" ")
        let out = ""
        let tmp = 0
        t.forEach(l => {
            out += '<span class="word">'
            let w = l.split("")
            w.forEach(c => {
                if (delay) {
                    out += '<span style=" transition-delay:' + tmp * .08 + 's" class="letter">'
                    out += c
                    out += '</span>'
                    tmp++
                } else {
                    out += '<span class="letter">'
                    out += c
                    out += '</span>'
                    tmp++
                }
            })
            out += '</span>'
        })
        return out
    },

    getComponent(name){
        for (let i = 0; i < this.$root.$children.length; i++) {
            const element = this.$root.$children[i];
            if (element.$options.name === name) {
                return element
            }
        }
    }

  }
}

export default Mixin