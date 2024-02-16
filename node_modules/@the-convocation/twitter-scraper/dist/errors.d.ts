export declare class ApiError extends Error {
    readonly response: Response;
    readonly data: any;
    private constructor();
    static fromResponse(response: Response): Promise<ApiError>;
}
interface Position {
    line: number;
    column: number;
}
interface TraceInfo {
    trace_id: string;
}
interface TwitterApiErrorExtensions {
    code?: number;
    kind?: string;
    name?: string;
    source?: string;
    tracing?: TraceInfo;
}
export interface TwitterApiErrorRaw extends TwitterApiErrorExtensions {
    message?: string;
    locations?: Position[];
    path?: string[];
    extensions?: TwitterApiErrorExtensions;
}
export {};
//# sourceMappingURL=errors.d.ts.map