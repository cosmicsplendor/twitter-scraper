const config = require('./config')
const FollowersScraper = require("./FollowersScraper")
const followersScraper = new FollowersScraper(config.credentials)
const fs = require("fs/promises")
const { ensureDirExists, fileExists, parseArgv } = require('./utils')
const { src=""} = parseArgv() // usage: node generateFollowingDatra.js src=source.js
if (src === "") throw new Error(`Invalid src argument or non existent source file. \nUsage example: node generateFollowingDatra src=source.js\n`)
const source = require(`./${src}`)

const SAVE_DIR = "./following data reservoir"
followersScraper
    .reset()
    .then(async () => {
        await ensureDirExists(SAVE_DIR)
        for (const index in source) {
            const n = Number(index) + 1
            const user = source[index]
            const savePath = `./${SAVE_DIR}/${user.username}.json`
            try {
                if (await fileExists(savePath)) {
                    console.log(`[${user.username}] following already scraped, skipping. .`)
                    continue
                }
                
                const following = await followersScraper.scrape(user.username, "following")
                console.log(`[${user.username}] saving followers`)
                await fs.writeFile(savePath, JSON.stringify(following))
                
                console.log(`Scraped ${n} out of ${source.length} profiles`)
            } catch(e) {
                console.log(`Error: ${e.message}`)
            }
        }
    })