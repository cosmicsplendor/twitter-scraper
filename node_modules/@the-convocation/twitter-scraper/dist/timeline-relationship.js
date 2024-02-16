"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRelationshipTimeline = void 0;
const profile_1 = require("./profile");
function parseRelationshipTimeline(timeline) {
    let bottomCursor;
    let topCursor;
    const profiles = [];
    const instructions = timeline.data?.user?.result?.timeline?.timeline?.instructions ?? [];
    for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries' ||
            instruction.type === 'TimelineReplaceEntry') {
            if (instruction.entry?.content?.cursorType === 'Bottom') {
                bottomCursor = instruction.entry.content.value;
                continue;
            }
            if (instruction.entry?.content?.cursorType === 'Top') {
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
exports.parseRelationshipTimeline = parseRelationshipTimeline;
//# sourceMappingURL=timeline-relationship.js.map