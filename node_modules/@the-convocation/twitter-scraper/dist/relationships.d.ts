import { TwitterAuth } from './auth';
import { Profile } from './profile';
import { QueryProfilesResponse } from './timeline-v1';
export declare function getFollowing(userId: string, maxProfiles: number, auth: TwitterAuth): AsyncGenerator<Profile, void>;
export declare function getFollowers(userId: string, maxProfiles: number, auth: TwitterAuth): AsyncGenerator<Profile, void>;
export declare function fetchProfileFollowing(userId: string, maxProfiles: number, auth: TwitterAuth, cursor?: string): Promise<QueryProfilesResponse>;
export declare function fetchProfileFollowers(userId: string, maxProfiles: number, auth: TwitterAuth, cursor?: string): Promise<QueryProfilesResponse>;
//# sourceMappingURL=relationships.d.ts.map