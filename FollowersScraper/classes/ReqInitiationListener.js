const EventEmitter = require("events")

class ReqInitiationListener extends EventEmitter {
    disposable = false
    constructor(match) {
        super()
        this.match = match
    }
    async reqHook(req, next) {
        if (this.disposable) return next()
        const url = req.url()
        const headers = req.headers()

        if (!url.match(`/${this.match}`)) return next()
        this.disposable = true
        super.emit("done", { url, headers })
        next()
    }
    async getReqPayload() {
        return new Promise(resolve => {
            this.on("done", payload => {
                console.log("Initial request payload loaded")
                resolve(payload)
            })
        })
    }
}

module.exports = ReqInitiationListener