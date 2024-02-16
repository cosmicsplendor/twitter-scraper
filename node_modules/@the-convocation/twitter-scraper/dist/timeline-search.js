"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchTimelineUsers = exports.parseSearchTimelineTweets = void 0;
const profile_1 = require("./profile");
const timeline_v2_1 = require("./timeline-v2");
function parseSearchTimelineTweets(timeline) {
    let bottomCursor;
    let topCursor;
    const tweets = [];
    const instructions = timeline.data?.search_by_raw_query?.search_timeline?.timeline
        ?.instructions ?? [];
    for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries' ||
            instruction.type === 'TimelineReplaceEntry') {
            if (instruction.entry?.content?.cursorType === 'Bottom') {
                bottomCursor = instruction.entry.content.value;
                continue;
            }
            else if (instruction.entry?.content?.cursorType === 'Top') {
                topCursor = instruction.entry.content.value;
                continue;
            }
            const entries = instruction.entries ?? [];
            for (const entry of entries) {
                const itemContent = entry.content?.itemContent;
                if (itemContent?.tweetDisplayType === 'Tweet') {
                    const tweetResultRaw = itemContent.tweet_results?.result;
                    const tweetResult = (0, timeline_v2_1.parseLegacyTweet)(tweetResultRaw?.core?.user_results?.result?.legacy, tweetResultRaw?.legacy);
                    if (tweetResult.success) {
                        if (!tweetResult.tweet.views && tweetResultRaw?.views?.count) {
                            const views = parseInt(tweetResultRaw.views.count);
                            if (!isNaN(views)) {
                                tweetResult.tweet.views = views;
                            }
                        }
                        tweets.push(tweetResult.tweet);
                    }
                }
                else if (entry.content?.cursorType === 'Bottom') {
                    bottomCursor = entry.content.value;
                }
                else if (entry.content?.cursorType === 'Top') {
                    topCursor = entry.content.value;
                }
            }
        }
    }
    return { tweets, next: bottomCursor, previous: topCursor };
}
exports.parseSearchTimelineTweets = parseSearchTimelineTweets;
function parseSearchTimelineUsers(timeline) {
    let bottomCursor;
    let topCursor;
    const profiles = [];
    const instructions = timeline.data?.search_by_raw_query?.search_timeline?.timeline
        ?.instructions ?? [];
    for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries' ||
            instruction.type === 'TimelineReplaceEntry') {
            if (instruction.entry?.content?.cursorType === 'Bottom') {
                bottomCursor = instruction.entry.content.value;
                continue;
            }
            else if (instruction.entry?.content?.cursorType === 'Top') {
                topCursor = instruction.entry.content.value;
                continue;
            }
            const entries = instruction.entries ?? [];
            for (const entry of entries) {
                const itemContent = entry.content?.itemContent;
                if (itemContent?.userDisplayType === 'User') {
                    const userResultRaw = itemContent.user_results?.result;
                    if (userResultRaw?.legacy) {
                        const profile = (0, profile_1.parseProfile)(userResultRaw.legacy, userResultRaw.is_blue_verified);
                        if (!profile.userId) {
                            profile.userId = userResultRaw.rest_id;
                        }
                        profiles.push(profile);
                    }
                }
                else if (entry.content?.cursorType === 'Bottom') {
                    bottomCursor = entry.content.value;
                }
                else if (entry.content?.cursorType === 'Top') {
                    topCursor = entry.content.value;
                }
            }
        }
    }
    return { profiles, next: bottomCursor, previous: topCursor };
}
exports.parseSearchTimelineUsers = parseSearchTimelineUsers;
//# sourceMappingURL=timeline-search.js.map