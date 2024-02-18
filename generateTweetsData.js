const config = require('./config')
const TweetsScraper = require("./TweetsScraper")
const tweetsScraper = new TweetsScraper(config.credentials)
const fs = require("fs/promises")
const { ensureDirExists, fileExists, parseArgv, wait } = require('./utils')
const { src=""} = parseArgv() // usage: node generateTweetsData.js src=accounts.json
if (src === "") throw new Error(`Invalid src argument or non existent source file. \nUsage example: node generateTweetsData src=accounts.json \n`)
const source = require(`./${src}`)

const SAVE_DIR = "./tweets data reservoir"
tweetsScraper
    .reset()
    .then(async () => {
        await ensureDirExists(SAVE_DIR)
        for (const index in source) {
            const n = Number(index) + 1
            const user = source[index]
            const savePath = `./${SAVE_DIR}/${user.username}.json`
            try {
                if (await fileExists(savePath)) {
                    console.log(`[${user.username}] tweets already scraped, skipping. .`)
                    continue
                }
                console.log(`[${user.username}]`)
                const tweets = await tweetsScraper.scrape(user.username, 50)
                if (tweets.length > 0) {
                    console.log(`[${user.username}] saving tweets`)
                    await fs.writeFile(savePath, JSON.stringify(tweets))
                    await wait(25)
                }
                console.log(`Scraped ${n} out of ${source.length} profiles`)
            } catch(e) {
                console.log(`Error: ${e.message}`)
            }
        }
    })