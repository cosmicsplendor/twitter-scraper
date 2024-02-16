const EventEmitter = require("events")
const { wait } = require("../../../utils")
const { vSplitPoint, parseVariables, retrieveDataFromJson, generateUrl } = require("./functions.js")

const THROTTLE = 0.5 // delay factor

class DataLoader extends EventEmitter {
    constructor(page, srcUrl, headers) {
        super()
        const initialUrl = srcUrl
        this.baseUrl = initialUrl.split(vSplitPoint)[0]
        this.headers = headers
        this.generateUrl = (() => {
            const { variables: {userId, count, cursor: _, ...rest}, features } = parseVariables(initialUrl)
            return (cursor) => {
                const variables = { userId, count, cursor, ...rest } // preserving the order
                return generateUrl(this.baseUrl, variables, features)
            }
        })();
        this.makeRequest = async (url, headers) => {
            try {
                return await page.evaluate(async (url, headers) => {
                    const res = await fetch(url, { headers })
                    const json = await res.json()
                    return json
                }, url, headers)
            } catch(e) {
            }
        }
        this.loadDataRecursively(initialUrl)
    }
    async loadDataRecursively(url) {
        try {
            const json = await this.makeRequest(url, this.headers)
            const data = retrieveDataFromJson(json)
            const { profiles, cursor } = data
            const nextUrl = this.generateUrl(cursor)

            super.emit("data", profiles)
            await wait(THROTTLE)
            if (data.terminate || profiles.length === 0) {
                console.log("Scraping Completed!")
                super.emit("termination")
                return
            }
            await this.loadDataRecursively(nextUrl)
        } catch(e) {
            console.log("Rate limit exeeded")
            console.log(e)
            super.emit("exit")
        }
    }
}

module.exports = DataLoader