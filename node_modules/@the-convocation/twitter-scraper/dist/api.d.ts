type FetchParameters = [input: RequestInfo | URL, init?: RequestInit];
export interface FetchTransformOptions {
    /**
     * Transforms the request options before a request is made. This executes after all of the default
     * parameters have been configured, and is stateless. It is safe to return new request options
     * objects.
     * @param args The request options.
     * @returns The transformed request options.
     */
    request: (...args: FetchParameters) => FetchParameters | Promise<FetchParameters>;
    /**
     * Transforms the response after a request completes. This executes immediately after the request
     * completes, and is stateless. It is safe to return a new response object.
     * @param response The response object.
     * @returns The transformed response object.
     */
    response: (response: Response) => Response | Promise<Response>;
}
export declare const bearerToken = "AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF";
/**
 * An API result container.
 */
export type RequestApiResult<T> = {
    success: true;
    value: T;
} | {
    success: false;
    err: Error;
};
export declare function addApiParams(params: URLSearchParams, includeTweetReplies: boolean): URLSearchParams;
export {};
//# sourceMappingURL=api.d.ts.map