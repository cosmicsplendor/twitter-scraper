import { QueryProfilesResponse } from './timeline-v1';
import { TimelineUserResultRaw } from './timeline-v2';
export interface RelationshipEntryItemContentRaw {
    itemType?: string;
    userDisplayType?: string;
    user_results?: {
        result?: TimelineUserResultRaw;
    };
}
export interface RelationshipEntryRaw {
    entryId: string;
    sortIndex: string;
    content?: {
        cursorType?: string;
        entryType?: string;
        __typename?: string;
        value?: string;
        itemContent?: RelationshipEntryItemContentRaw;
    };
}
export interface RelationshipTimeline {
    data?: {
        user?: {
            result?: {
                timeline?: {
                    timeline?: {
                        instructions?: {
                            entries?: RelationshipEntryRaw[];
                            entry?: RelationshipEntryRaw;
                            type?: string;
                        }[];
                    };
                };
            };
        };
    };
}
export declare function parseRelationshipTimeline(timeline: RelationshipTimeline): QueryProfilesResponse;
//# sourceMappingURL=timeline-relationship.d.ts.map