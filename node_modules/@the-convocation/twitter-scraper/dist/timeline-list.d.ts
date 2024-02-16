import { QueryTweetsResponse } from './timeline-v1';
import { TimelineEntryRaw } from './timeline-v2';
export interface ListTimeline {
    data?: {
        list?: {
            tweets_timeline?: {
                timeline?: {
                    instructions?: {
                        entries?: TimelineEntryRaw[];
                        entry?: TimelineEntryRaw;
                        type?: string;
                    }[];
                };
            };
        };
    };
}
export declare function parseListTimelineTweets(timeline: ListTimeline): QueryTweetsResponse;
//# sourceMappingURL=timeline-list.d.ts.map