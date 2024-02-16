const parseParams = encodedJson => {
    const decodedJson = decodeURIComponent(encodedJson)
    const json = JSON.parse(decodedJson)
    return json
}
const parseVariables = input => {
    const url = decodeURI(input)
    const queryParams = url.split("?variables=")[1]
    const [ variablesStr, featuresStr ] = queryParams.split("&features=")

    return {
        variables: parseParams(variablesStr),
        features: parseParams(featuresStr)
    }
}
const serializeParam = obj => {
    const jsonString = JSON.stringify(obj)
    const encodedJson = encodeURIComponent(jsonString)
    return encodedJson
}
const generateUrl = (baseUrl, variables, features) => {
    const vParam = serializeParam(variables)
    const fParam = features ? serializeParam(features): ""
    const rawUrl = baseUrl + "?variables=" + vParam + (fParam ? "&features=" + fParam: "")
    const url = encodeURI(rawUrl).replace(/%25/g, "%")
    return url
}
const fetch = async (page, url, headers) => {
    return await page.evaluate(async (url, headers) => {
        const res = await fetch(url, { headers })
        const text = await res.text()
        try {
            return JSON.parse(text)
        } catch(e) {
            return text + " Status: " + res.status
        }
    }, url, headers)
}

const userBaseUrl = "https://twitter.com/i/api/graphql/Bhlf1dYJ3bYCKmLfeEQ31A/UserByScreenName"
const getTweetsBaseUrl = apiId => `https://twitter.com/i/api/graphql/${apiId}/UserTweets`
const getTweetsVariables = userId => ({
    "userId": userId,
    "count": 60,
    "includePromotedContent": false,
    "withQuickPromoteEligibilityTweetFields": false,
    "withVoice": true,
    "withV2Timeline": true
})
const userTweetFeatures = {
    "responsive_web_graphql_exclude_directive_enabled": true,
    "verified_phone_label_enabled": false,
    "creator_subscriptions_tweet_preview_api_enabled": true,
    "responsive_web_graphql_timeline_navigation_enabled": true,
    "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
    "c9s_tweet_anatomy_moderator_badge_enabled": true,
    "tweetypie_unmention_optimization_enabled": true,
    "responsive_web_edit_tweet_api_enabled": true,
    "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
    "view_counts_everywhere_api_enabled": true,
    "longform_notetweets_consumption_enabled": true,
    "responsive_web_twitter_article_tweet_consumption_enabled": true,
    "tweet_awards_web_tipping_enabled": false,
    "freedom_of_speech_not_reach_fetch_enabled": true,
    "standardized_nudges_misinfo": true,
    "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
    "rweb_video_timestamps_enabled": true,
    "longform_notetweets_rich_text_read_enabled": true,
    "longform_notetweets_inline_media_enabled": true,
    "responsive_web_enhance_cards_enabled": false
}

const retrieveUrlFromScreenName = async (page, screenName, headers, apiId) => {
    try {
        const userVariables = { screen_name: screenName, withSafetyModeUserFields: true, withSuperFollowsUserFields: true }
        const userUrl = generateUrl(userBaseUrl, userVariables)
        const json = await fetch(page, userUrl, headers)
        const restId = json.data.user.result.rest_id
        const tweetsVariables = getTweetsVariables(restId)
        const tweetsUrl = generateUrl(getTweetsBaseUrl(apiId), tweetsVariables, userTweetFeatures)
        return tweetsUrl
    } catch(e) {
        console.log(e.message)
        return null
    }
}
const findPinnedEntry = instructions => {
    try {
        const pinnedEntry = instructions[1] && instructions[1].type === "TimelinePinEntry" ? instructions[1].entry : null
        if (pinnedEntry) pinnedEntry.content.itemContent.tweet_results.result.legacy.is_pinned = true
        return pinnedEntry
    } catch{}
}
const retrieveDataFromJson = json => {
    try {
        const instructions = json.data.user.result.timeline_v2.timeline.instructions
        const terminate = Boolean(instructions[0] && instructions[0] && instructions[0].type === "TimelineTerminateTimeline")
        const clearCache = Boolean(instructions[0] && instructions[0] && instructions[0].type === "TimelineClearCache")
        const pinnedEntry = findPinnedEntry(instructions)
        const entriesIterator = terminate ? instructions[1].entries : 
                                    clearCache ? (pinnedEntry ? instructions[2].entries: instructions[1].entries):
                                    instructions.entries()
        const data = { tweets: [], cursor: null, terminate }
        const addEntries = entries => {
            entries.forEach(entry => {
                try {
                    if (/(bottom|top)/i.test(entry.entryId)) return
                    const { created_at, retweet_count, reply_count, quote_count, is_pinned, full_text, favorite_count, retweeted_status_result, in_reply_to_screen_name } = entry.content.itemContent.tweet_results.result.legacy
                    const replied = Boolean(in_reply_to_screen_name)
                    const retweeted = Boolean(retweeted_status_result)
                    const createdAt = retweeted ?  retweeted_status_result.result.legacy.created_at: created_at
                    const createdTs = new Date(createdAt).valueOf()
                    const retweetedTs = retweeted ? new Date(created_at).valueOf(): ""
                    const retweetedFrom = retweeted ? retweeted_status_result.result.core.user_results.result.legacy.screen_name: ""
                    const content = retweeted ? retweeted_status_result.result.legacy.full_text:
                                    replied ? full_text.replace(/^(@[a-zA-Z_0-9]+\s)+/, ""): full_text
                    const replyingTo = replied ? full_text.match(/^(@[a-zA-Z_0-9]+\s)+/)[0].trim(): ""

                    data.tweets.push({
                        Content: content,
                        Type: retweeted ? "Retweet": replied ? "Reply": is_pinned ? "PinnedTweet": "Tweet",
                        Retweets: retweet_count,
                        Likes: favorite_count,
                        Replies: reply_count,
                        // "Quoted Count": quote_count,
                        // "Tweeted At": createdTs,
                        // "Retweeted At": retweetedTs,
                        // "Retweeted From": retweetedFrom,
                        // "Replying To": replyingTo
                    })
                } catch (e) { }
            })
        }
        if (terminate) {
            addEntries(entriesIterator)
            return data
        }
        const processEntries = entries => {
            try {
                addEntries(entries)
                const bottomCursor = entries.find(cursor => cursor && cursor.content && cursor.content.cursorType === "Bottom")
                const cursorValue = bottomCursor.content.value
                data.cursor = cursorValue
            } catch (e) {
              return data
            }
        }
        if (clearCache) {
            const entries = pinnedEntry ? [ pinnedEntry ].concat(entriesIterator): entriesIterator
            processEntries(entries)
            return data
        }
        for (const rawEntries of entriesIterator) {
            const entries = rawEntries[1].entries
            processEntries(entries)
        }
        return data
    } catch (e) {
        // { errors: [ { message: 'Bad guest token', code: 239 } ] }
        const private = json && json.data && json.data.user && json.data.user.result && json.data.user.result.__typename === 'UserUnavailable'
        const blocked = json && json.errors && json.errors.find && json.errors.find(e => e.code === 366)
        const badToken = json && json.errors && json.errors.find && json.errors.find(e => e.code === 239)
        if (badToken) process.exit(0)
        if (private || blocked) {
            console.log(`this user profile is ${ private ? "private": "blocked" }`)
            return {
                terminate: true,
                tweets: []
            }
        }
        console.log(json)
        console.log(e.message)
    }
}

module.exports = {
    generateUrl,
    parseVariables,
    retrieveUrlFromScreenName,
    retrieveDataFromJson,
    fetch,
    getTweetsBaseUrl
}