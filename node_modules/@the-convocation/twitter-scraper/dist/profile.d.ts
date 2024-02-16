import { RequestApiResult } from './api';
import { TwitterAuth } from './auth';
import { TwitterApiErrorRaw } from './errors';
export interface LegacyUserRaw {
    created_at?: string;
    description?: string;
    entities?: {
        url?: {
            urls?: {
                expanded_url?: string;
            }[];
        };
    };
    favourites_count?: number;
    followers_count?: number;
    friends_count?: number;
    media_count?: number;
    statuses_count?: number;
    id_str?: string;
    listed_count?: number;
    name?: string;
    location: string;
    geo_enabled?: boolean;
    pinned_tweet_ids_str?: string[];
    profile_background_color?: string;
    profile_banner_url?: string;
    profile_image_url_https?: string;
    protected?: boolean;
    screen_name?: string;
    verified?: boolean;
    has_custom_timelines?: boolean;
    has_extended_profile?: boolean;
    url?: string;
    can_dm?: boolean;
}
/**
 * A parsed profile object.
 */
export interface Profile {
    avatar?: string;
    banner?: string;
    biography?: string;
    birthday?: string;
    followersCount?: number;
    followingCount?: number;
    friendsCount?: number;
    mediaCount?: number;
    statusesCount?: number;
    isPrivate?: boolean;
    isVerified?: boolean;
    isBlueVerified?: boolean;
    joined?: Date;
    likesCount?: number;
    listedCount?: number;
    location: string;
    name?: string;
    pinnedTweetIds?: string[];
    tweetsCount?: number;
    url?: string;
    userId?: string;
    username?: string;
    website?: string;
    canDm?: boolean;
}
export interface UserRaw {
    data: {
        user: {
            result: {
                rest_id?: string;
                is_blue_verified?: boolean;
                legacy: LegacyUserRaw;
            };
        };
    };
    errors?: TwitterApiErrorRaw[];
}
export declare function parseProfile(user: LegacyUserRaw, isBlueVerified?: boolean): Profile;
export declare function getProfile(username: string, auth: TwitterAuth): Promise<RequestApiResult<Profile>>;
export declare function getUserIdByScreenName(screenName: string, auth: TwitterAuth): Promise<RequestApiResult<string>>;
//# sourceMappingURL=profile.d.ts.map