const puppeteer = require("puppeteer-extra")
const stealthPlugin = require("puppeteer-extra-plugin-stealth")
const fs = require("fs")
const fsP = require("fs/promises")
const path = require("path")

puppeteer.use(stealthPlugin())
const selectorExists = async (page, sel) => {
    return await page.evaluate(sel => {
        return !!document.querySelector(sel)
    }, sel)
}
const createBrowser = async ({ headless = true, ignoreHTTPSErrors = true, windowWidth = 1920, windowHeight= 1080, noSandbox = false, exposeGc = false } = {}) => {
    try {
        const args = [  "--disable-web-security" ]
        args.push(`--window-size=${windowWidth},${windowHeight}`)
        if (noSandbox) args.push("--no-sandbox")
        if (exposeGc) args.push("--js-flags=--expose-gc")
        const browser = await puppeteer.launch({
            headless,
            ignoreHTTPSErrors,
            args
        })
        return browser
    } catch (e) {
        console.log("Encountered an error while launching the browser")
        console.log(e)
        process.exit(1)
    }
}
const navigate = async (page, { url, waitFor = "body", retry = true, referer, timeout = 30000 }) => {
    try {
        if (!!referer) page.setExtraHTTPHeaders({ referer })
        await page.goto(url, { timeout })
        await page.waitForSelector(waitFor, { timeout })
    } catch (e) {
        console.log(`[x] ${e.message}`)
        if (!retry) throw new Error("navigation timeout exceeded")
        console.log("retrying. .")
        await navigate(page, { url, waitFor, retry })
    }
}

const makePageLean = (page, allowedOverrides = [], preHook) => {
    const disallowedTypes = [
        "image", "stylesheet", "script", "font"
    ]
    page.setRequestInterception(true)
    page.on("request", async req => {
        const next = () => {
            const type = req.resourceType()
            const abortRequest = disallowedTypes.includes(type) && !allowedOverrides.includes(type)
            if (abortRequest) {
                return req.abort()
            }
            req.continue()
        }
        preHook && preHook(req, next, page)
        !preHook && next()
    })
}
const createLeanPage = async (browser, allowedOverrides, preHook) => {
    const page = await browser.newPage()
    makePageLean(page, allowedOverrides, preHook)
    return page
}
const fillInput = async (page, selector, value) => {
    await page.focus(selector)
    await page.keyboard.type(value)
}

const pingSelector = async (page, selector) => {
    try {
        await page.waitForSelector(selector, { timeout: 15000 })
        return selector
    } catch {
        return null
    }
}

const wait = (secs = 0, reject = false) => new Promise((res, rej) => {
    const callback = reject === true ? () => rej("Wait Timeout Rejection") : res
    setTimeout(callback, secs * 1000)
})

const fileExists = async filePath => {
    try {
        await fsP.stat(filePath)
        return true
    } catch(e) {
        return false
    }
}
const ensureDirExists = async filePath => {
    try {
        await fsP.stat(filePath)
    } catch(e) {
        await fsP.mkdir(filePath)
    }
}

const parseArgv = () => {
    const argsArr = process.argv.slice(2)
    const parseArgStr = argStr => {
        const [key, val] = argStr.split("=").map(str => str.trim())
        const numericVal = Number(val)
        return {
            [key]: Number.isNaN(numericVal) ? val : Number(val)
        }
    }
    const argsHash = argsArr.reduce((hash, argStr) => {
        const parsedArg = parseArgStr(argStr)
        return Object.assign({}, hash, parsedArg)
    }, {})
    return argsHash
}

const rand = (start, end) => {
    return start + Math.round(Math.random() * (end - start))
}
const pickOne = arr => arr[rand(0, arr.length - 1)]


const readDir = loc => {
    return new Promise((resolve, reject) => {
        fs.readdir(loc, { withFileTypes: true }, (err, files) => {
            if (err) {
                return reject(err)
            }
            resolve(files)
        })
    })
}
const flatten = arr => {
    return arr.reduce((acc, x) => acc.concat(x), [])
}
const enumerateFiles = async rootDir => {
    const results = await readDir(rootDir)
    const files = results.filter(result => {
        return result.isFile()
    }).map(file => path.join(rootDir, file.name))
    const directories = results.filter(result => {
        return result.isDirectory()
    }).map(dir => path.join(rootDir, dir.name))

    const allFiles = files

    const nestedFiles = flatten(await Promise.all(directories.map(dir => enumerateFiles(dir))))
    return allFiles.concat(nestedFiles)
}
module.exports = {
    createBrowser,
    wait,
    navigate,
    selectorExists,
    pingSelector,
    makePageLean,
    createLeanPage,
    fillInput,
    ensureDirExists,
    parseArgv,
    rand, pickOne,
    fileExists
}