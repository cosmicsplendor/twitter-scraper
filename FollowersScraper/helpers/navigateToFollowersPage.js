const selectors = require("../selectors")
const { navigate } = require('../../utils')

const navigateToFollowersPage = async (loggedInPage, accountHandle, tab="following",) => { // tab needs to be one of follower|following
    console.log("Navigating to the followers tab")
    await navigate(loggedInPage, { url: `https://x.com/${accountHandle}/${tab}`, waitFor: selectors.followerLink(accountHandle, tab), timeout: 30000 })
    try {
        await loggedInPage.waitForSelector(selectors.protectedAccount, { timeout: 10000 })
    } catch{}
    const pageProtected = (await loggedInPage.$$eval(selectors.protectedAccount, nodes => {
        return nodes.map(() => 1)
    })).length === 1
    if (pageProtected) throw new Error(`Cannot scrape followers because this account is protected`)
}

module.exports = navigateToFollowersPage