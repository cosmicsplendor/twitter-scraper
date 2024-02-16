const EventEmitter = require("events")

class ReqInitiationListener extends EventEmitter {
    done = false
    constructor(match) {
        super()
        this.match = match
    }
    async reqHook(req, next) {
        if (this.done) return next()
        const url = req.url()
        const headers = req.headers()

        if (!url.match(this.match)) return next()
        const apiId = url.match(/\/graphql\/(.+?)\//)
        super.emit("done", { headers, apiId: apiId && apiId[1] })
        this.done = true
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