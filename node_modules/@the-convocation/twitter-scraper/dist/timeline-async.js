"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweetTimeline = exports.getUserTimeline = void 0;
async function* getUserTimeline(query, maxProfiles, fetchFunc) {
    let nProfiles = 0;
    let cursor = undefined;
    let consecutiveEmptyBatches = 0;
    while (nProfiles < maxProfiles) {
        const batch = await fetchFunc(query, maxProfiles, cursor);
        const { profiles, next } = batch;
        cursor = next;
        if (profiles.length === 0) {
            consecutiveEmptyBatches++;
            if (consecutiveEmptyBatches > 5)
                break;
        }
        else
            consecutiveEmptyBatches = 0;
        for (const profile of profiles) {
            if (nProfiles < maxProfiles)
                yield profile;
            else
                break;
            nProfiles++;
        }
        if (!next)
            break;
    }
}
exports.getUserTimeline = getUserTimeline;
async function* getTweetTimeline(query, maxTweets, fetchFunc) {
    let nTweets = 0;
    let cursor = undefined;
    while (nTweets < maxTweets) {
        const batch = await fetchFunc(query, maxTweets, cursor);
        const { tweets, next } = batch;
        if (tweets.length === 0) {
            break;
        }
        for (const tweet of tweets) {
            if (nTweets < maxTweets) {
                cursor = next;
                yield tweet;
            }
            else {
                break;
            }
            nTweets++;
        }
    }
}
exports.getTweetTimeline = getTweetTimeline;
//# sourceMappingURL=timeline-async.js.map