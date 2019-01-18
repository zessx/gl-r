
if ("performance" in window == false) {
    window.performance = {};
}

Date.now = (Date.now || function () {  // thanks IE8
    return new Date().getTime();
});

if ("now" in window.performance == false) {

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now() {
        return Date.now() - nowOffset;
    }
}

class RAF {
    constructor() {
        this.funcs = {}
        this.dt = Infinity
        this.dictonary = []
        this.last = performance.now()
        this.initTime = performance.now()
        this.init()
    }

    suscribe(id, func) {
        this.dictonary.push(id)
        this.funcs[id] = func
    }

    unsuscribe(id) {
        if (this.funcs[id]) {
            this.dictonary.splice(this.dictonary.indexOf(id), 1)
            delete this.funcs[id]
        }
    }

    init() {
        this.update = this.update.bind(this)
        this.update()
    }

    update() {
        requestAnimationFrame(this.update)

        this.dt = performance.now() - this.last

        for (let i = 0; i < this.dictonary.length; i++) {
            this.funcs[this.dictonary[i]]()
        }

        this.last = performance.now()
    }

}
const out = new RAF()
export default out