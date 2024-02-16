const { createLeanPage } = require("../utils")
const ReqInitiationListener = require("./ReqInitiationListener.js")
const selectors = require("../FollowersScraper/selectors")
const triggerLoad = async (page, username) => {
    try {
        await page.goto(`https://x.com/${username}`, { timeout: 15000 })
    } catch(e) { console.log(e.message)}
    try {
        await page.waitForSelector(selectors.protectedAccount, { timeout: 7500 })
    } catch{}
    const pageProtected = (await page.$$eval(selectors.protectedAccount, nodes => {
        return nodes.map(() => 1)
    })).length === 1
    if (pageProtected) throw new Error(`Cannot scrape followers because this account is protected`)
}
class ReqMeta {
    _browser = null
    _headers = null
    _apiId = null
    constructor(browser) {
        this._browser = browser
    }
    get headers() {
        return this._headers
    }
    get apiId() {
        return this._apiId
    }
    async generate(username="USMNT") {
        console.log("Generating Payload")
        const reqInitiationListener = new ReqInitiationListener("UserTweets")
        const boundReqHook = reqInitiationListener.reqHook.bind(reqInitiationListener)
        const page = await createLeanPage(this._browser, ["script"], boundReqHook)
        const [ { headers, apiId } ] = await Promise.all([ reqInitiationListener.getReqPayload(), triggerLoad(page, username) ])
        this._headers = headers
        this._apiId = apiId
        console.log("Payload Generated")
        return page
    }
}

module.exports = ReqMeta