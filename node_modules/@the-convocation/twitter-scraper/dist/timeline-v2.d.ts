import { LegacyUserRaw } from './profile';
import { LegacyTweetRaw, ParseTweetResult, QueryTweetsResponse, SearchResultRaw, TimelineResultRaw } from './timeline-v1';
import { Tweet } from './tweets';
export interface TimelineUserResultRaw {
    rest_id?: string;
    legacy?: LegacyUserRaw;
    is_blue_verified?: boolean;
}
export interface TimelineEntryItemContentRaw {
    itemType?: string;
    tweetDisplayType?: string;
    tweetResult?: {
        result?: TimelineResultRaw;
    };
    tweet_results?: {
        result?: TimelineResultRaw;
    };
    userDisplayType?: string;
    user_results?: {
        result?: TimelineUserResultRaw;
    };
}
export interface TimelineEntryRaw {
    entryId: string;
    content?: {
        cursorType?: string;
        value?: string;
        items?: {
            entryId?: string;
            item?: {
                content?: TimelineEntryItemContentRaw;
                itemContent?: SearchEntryItemContentRaw;
            };
        }[];
        itemContent?: TimelineEntryItemContentRaw;
    };
}
export interface SearchEntryItemContentRaw {
    tweetDisplayType?: string;
    tweet_results?: {
        result?: SearchResultRaw;
    };
    userDisplayType?: string;
    user_results?: {
        result?: TimelineUserResultRaw;
    };
}
export interface SearchEntryRaw {
    entryId: string;
    sortIndex: string;
    content?: {
        cursorType?: string;
        entryType?: string;
        __typename?: string;
        value?: string;
        items?: {
            item?: {
                content?: SearchEntryItemContentRaw;
            };
        }[];
        itemContent?: SearchEntryItemContentRaw;
    };
}
export interface TimelineInstruction {
    entries?: TimelineEntryRaw[];
    entry?: TimelineEntryRaw;
    type?: string;
}
export interface TimelineV2 {
    data?: {
        user?: {
            result?: {
                timeline_v2?: {
                    timeline?: {
                        instructions?: TimelineInstruction[];
                    };
                };
            };
        };
    };
}
export interface ThreadedConversation {
    data?: {
        threaded_conversation_with_injections_v2?: {
            instructions?: TimelineInstruction[];
        };
    };
}
export declare function parseLegacyTweet(user?: LegacyUserRaw, tweet?: LegacyTweetRaw): ParseTweetResult;
export declare function parseTimelineTweetsV2(timeline: TimelineV2): QueryTweetsResponse;
export declare function parseTimelineEntryItemContentRaw(content: TimelineEntryItemContentRaw, entryId: string, isConversation?: boolean): Tweet | null;
export declare function parseAndPush(tweets: Tweet[], content: TimelineEntryItemContentRaw, entryId: string, isConversation?: boolean): void;
export declare function parseThreadedConversation(conversation: ThreadedConversation): Tweet[];
//# sourceMappingURL=timeline-v2.d.ts.map