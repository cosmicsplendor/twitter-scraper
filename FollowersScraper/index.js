const { createBrowser, createLeanPage, pickOne } = require("../utils")
const login = require("./helpers/login")
const navigateToFollowersPage = require("./helpers/navigateToFollowersPage")
const ReqInitiationListener = require("./classes/ReqInitiationListener")
const DataLoader = require('./classes/DataLoader')

class FollowersScraper {
    credentials = [] // { username: string, password: string, handle: string }[]
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
            await login(tempPage, pickOne(this.credentials))
            await tempPage.close()
        } catch(e) {
            console.log(e.message)
            console.log(`Retrying resetting browser`)
            await this.reset()
        }
    }
    async scrape(accountHandle, type="following") {
        return new Promise(async (resolve, reject) => {
            const data = []
            const reqInitListener = new ReqInitiationListener(type === "following" ? "Following": "Followers")
            const boundReqHook = reqInitListener
                .reqHook.bind(reqInitListener)
            const page = await createLeanPage(
                this.browser, [ "script" ], boundReqHook
            )
            const [ { url, headers } ] = await Promise.all([ 
                reqInitListener.getReqPayload(), 
                navigateToFollowersPage(page, accountHandle, type).catch(reject) 
            ])
            const dataLoader = new DataLoader(page, url, headers)

            dataLoader.on("data", profiles => {
                profiles.forEach(profileData => {
                    data.push(profileData)
                })
                console.log(`[${accountHandle}] Rows Scraped: ${data.length}`)
            })
            dataLoader.on("exit", () => {
                console.log("Rate limit reached")
                this.reset().then(() => reject("Rate limit exceeded"))
            })
            dataLoader.on("termination", () => {
                resolve(data)
            })
        })
    }
}

module.exports = FollowersScraper