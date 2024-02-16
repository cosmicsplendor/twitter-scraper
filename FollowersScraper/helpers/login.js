const { navigate, pingSelector, wait, fillInput  } = require("../../utils")
const selectors = require("../selectors")

const getNextBtnSelector = async (page) => {
    return await Promise.race([ selectors.nextButton, selectors.altNextButton, selectors.altAltNextButton ].map(selector => pingSelector(page, selector)))
}

const followLoginFlow = async (page, credential, selectors) => {
    // username
    console.log("Typing username...")
    await wait(1)
    await page.waitForSelector(selectors.username)
    await fillInput(page, selectors.username, credential.username)
    await page.click(await getNextBtnSelector(page, selectors))

    // handle
    const tHandleSelector = await pingSelector(page, selectors.tHandle)
    if (tHandleSelector) {
        console.log("Getting through a question")
        await wait(1)
        await fillInput(page, tHandleSelector, credential.handle)
        await page.click(selectors.tHandleNextBtn)
    }

    // password
    console.log("Typing password")
    await wait(1)
    await page.waitForSelector(selectors.password)
    await page.focus(selectors.password)
    await page.keyboard.type(credential.password)
    await page.click(await getNextBtnSelector(page, selectors))
    await page.waitForNavigation()
}


const logIn = async (page, credential) => {
    try {
        await page.setBypassCSP(true)

        console.log("Breaking into login page")
        await navigate(page, { url: "https://twitter.com/i/flow/login" })

        console.log("following login flow")
        await followLoginFlow(page, credential, selectors)
    } catch(e) { 
        console.log(e.message)
    }
}

module.exports = logIn