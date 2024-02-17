const fs = require("fs/promises")
const { parseArgv } = require('./utils')
const { src = "", iter=0 } = parseArgv() // usage: node generateFollowingDatra.js src=source.js
if (src === "") throw new Error(`Invalid src argument or non existent source file. \nUsage example: node generateAccounts src=source.js iter=1\n`)
if (iter === 0) throw new Error(`Invalid iter argument. \nUsage example: node generateAccounts src=source.js iter=1\n`)
const source = require(`./${src}`)
const SAVE_DIR = "./following data reservoir"
const { commonFollowersThreshold } = require("./config.js")

const readFollowing = async accountName => {
    try {
        const followingList = require(`./${SAVE_DIR}/${accountName}.json`)
        return followingList
    } catch {
        return []
    }
}

const generateAccounts = async () => {
    const seedFollowingFollowers = {}
    for (const index in source) {
        const n = Number(index) + 1
        const user = source[index]
        try {
            const following = await readFollowing(user.username)
            for (const fl of following) {
                if (Array.isArray(seedFollowingFollowers[fl.screen_name])) {
                    seedFollowingFollowers[fl.screen_name].push(user.username)
                } else {
                    seedFollowingFollowers[fl.screen_name] = [user.username]
                }
            }
            console.log(`Processed ${n} out of ${source.length} profiles`)
        } catch (e) {
            console.log(`Error: ${e.message}`)
        }
    }
    const accounts = Object
        .entries(seedFollowingFollowers)
        .sort((a, b) => {
            return b[1].length - a[1].length
        })
        .map(x => {
            return {
                username: x[0],
                link: `https://x.com/${x[0]}`,
                iteration: iter,
                followedBy: x[1].length,
                followers: x[1],
            }
        })
        .filter(x => {
            return x.followedBy >= commonFollowersThreshold
        })
        .filter(x => {
            return source.findIndex(s => s.username === x.username) === -1
        })
    console.log(`Saving ${accounts.length} accounts`)
    await fs.writeFile("./accounts.json", JSON.stringify(accounts, undefined, 2))
    await fs.writeFile("./accounts.lean.json", JSON.stringify(accounts.map(account => account.username)))
}

generateAccounts()