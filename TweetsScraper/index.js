const { createBrowser, createLeanPage, pickOne } = require("../utils")
const login = require("../FollowersScraper/helpers/login")
const DataLoader = require('./DataLoader')
const ReqMeta = require("./ReqMeta")

class TweetsScraper {
    credentials = [] // { username: string, password: string, handle: string }[]
    credential=pickOne([0, 1])
    browser = null
    constructor(credentials) {
        this.credentials = credentials
    }
    async reset() {
        try {
            console.log("Resetting the browser")
            if (this.browser !== null) this.browser.close()
            this.browser = await createBrowser({ 
                headless: "new"
            })
            const tempPage = await createLeanPage(
                this.browser, [ "script" ]
            )
            console.table(this.credentials[this.credential])
            await login(tempPage, this.credentials[this.credential])
            this.credential = (this.credential + 1) % 2
            await tempPage.close()
        } catch(e) {
            console.log(e.message)
            console.log(`Retrying resetting browser`)
            await this.reset()
        }
    }
    async scrape(username, MAX=20) {
        try {
            const reqMeta = new ReqMeta(this.browser)
            let page
            try {
                page = await reqMeta.generate(username)
            } catch(e) {
                console.log(e.message)
                return []
            }
            
            const dataLoader = new DataLoader(page, username, reqMeta.headers, reqMeta.apiId, MAX)
            const tweets = await dataLoader.load()
            await page.close()
            return tweets
        } catch(e) {
            console.log(e)
            await this.reset()
        }
    }
}

module.exports = TweetsScraper