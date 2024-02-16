const EventEmitter = require("events")
const { retrieveUrlFromScreenName, retrieveDataFromJson, fetch, getTweetsBaseUrl, generateUrl, parseVariables } = require("./functions.js")

class DataLoader extends EventEmitter {
    constructor(page, username, headers, apiId, numOfTweets=50) {
        super()
        this.page = page
        this.headers = headers
        this.apiId = apiId
        this.username = username
        this.numOfTweets = numOfTweets
    }
    async load() {
        const initialUrl = await retrieveUrlFromScreenName(this.page, this.username, this.headers, this.apiId)
        if (!initialUrl) {
            console.log(`profile with handle ${this.username} has been deleted`)
            return []
        }
        this.generateUrl = (() => {
            const { variables, features } = parseVariables(initialUrl)
            const { userId, count, cursor: _, ...rest } = variables
            return cursor => {
                const augVariables = { userId, count, cursor, ...rest } // preserving the order
                return generateUrl(getTweetsBaseUrl(this.apiId), augVariables, features)
            }
        })();

        return await this.loadDataRecursively(initialUrl)
    }
    async loadDataRecursively(url, loaded=[]) {
        try {
            const json = await fetch(this.page, url, this.headers)
            require("fs").writeFileSync("test.json", JSON.stringify(json))
            const data = retrieveDataFromJson(json)
            const { tweets, cursor, terminate } = data
            loaded = loaded.concat(tweets)
            if (terminate || tweets.length === 0 || loaded.length >= this.numOfTweets) {
                console.log(`Finished Scraping ${this.username}!`)
                return loaded.slice(0, this.numOfTweets)
            }
            const nextUrl = this.generateUrl(cursor, this.baseUrl)
            return await this.loadDataRecursively(nextUrl, loaded)
        } catch(e) {
            console.log(`[${this.username}] Rate limit exeeded`)
            throw new Error(e)
        }
    }
}

module.exports = DataLoader