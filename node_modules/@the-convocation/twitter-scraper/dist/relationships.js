"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProfileFollowers = exports.fetchProfileFollowing = exports.getFollowers = exports.getFollowing = void 0;
const api_1 = require("./api");
const timeline_async_1 = require("./timeline-async");
const timeline_relationship_1 = require("./timeline-relationship");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
function getFollowing(userId, maxProfiles, auth) {
    return (0, timeline_async_1.getUserTimeline)(userId, maxProfiles, (q, mt, c) => {
        return fetchProfileFollowing(q, mt, auth, c);
    });
}
exports.getFollowing = getFollowing;
function getFollowers(userId, maxProfiles, auth) {
    return (0, timeline_async_1.getUserTimeline)(userId, maxProfiles, (q, mt, c) => {
        return fetchProfileFollowers(q, mt, auth, c);
    });
}
exports.getFollowers = getFollowers;
async function fetchProfileFollowing(userId, maxProfiles, auth, cursor) {
    const timeline = await getFollowingTimeline(userId, maxProfiles, auth, cursor);
    return (0, timeline_relationship_1.parseRelationshipTimeline)(timeline);
}
exports.fetchProfileFollowing = fetchProfileFollowing;
async function fetchProfileFollowers(userId, maxProfiles, auth, cursor) {
    const timeline = await getFollowersTimeline(userId, maxProfiles, auth, cursor);
    return (0, timeline_relationship_1.parseRelationshipTimeline)(timeline);
}
exports.fetchProfileFollowers = fetchProfileFollowers;
async function getFollowingTimeline(userId, maxItems, auth, cursor) {
    if (!auth.isLoggedIn()) {
        throw new Error('Scraper is not logged-in for profile following.');
    }
    if (maxItems > 50) {
        maxItems = 50;
    }
    const variables = {
        userId,
        count: maxItems,
        includePromotedContent: false,
    };
    const features = (0, api_1.addApiFeatures)({
        responsive_web_twitter_article_tweet_consumption_enabled: false,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
        longform_notetweets_inline_media_enabled: true,
        responsive_web_media_download_video_enabled: false,
    });
    if (cursor != null && cursor != '') {
        variables['cursor'] = cursor;
    }
    const params = new URLSearchParams();
    params.set('features', (0, json_stable_stringify_1.default)(features));
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    const res = await (0, api_1.requestApi)(`https://twitter.com/i/api/graphql/iSicc7LrzWGBgDPL0tM_TQ/Following?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    return res.value;
}
async function getFollowersTimeline(userId, maxItems, auth, cursor) {
    if (!auth.isLoggedIn()) {
        throw new Error('Scraper is not logged-in for profile followers.');
    }
    if (maxItems > 50) {
        maxItems = 50;
    }
    const variables = {
        userId,
        count: maxItems,
        includePromotedContent: false,
    };
    const features = (0, api_1.addApiFeatures)({
        responsive_web_twitter_article_tweet_consumption_enabled: false,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
        longform_notetweets_inline_media_enabled: true,
        responsive_web_media_download_video_enabled: false,
    });
    if (cursor != null && cursor != '') {
        variables['cursor'] = cursor;
    }
    const params = new URLSearchParams();
    params.set('features', (0, json_stable_stringify_1.default)(features));
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    const res = await (0, api_1.requestApi)(`https://twitter.com/i/api/graphql/rRXFSG5vR6drKr5M37YOTw/Followers?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    return res.value;
}
//# sourceMappingURL=relationships.js.map