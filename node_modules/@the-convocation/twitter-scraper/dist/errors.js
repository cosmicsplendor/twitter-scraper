"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(response, data, message) {
        super(message);
        this.response = response;
        this.data = data;
    }
    static async fromResponse(response) {
        // Try our best to parse the result, but don't bother if we can't
        let data = undefined;
        try {
            data = await response.json();
        }
        catch {
            try {
                data = await response.text();
            }
            catch { }
        }
        return new ApiError(response, data, `Response status: ${response.status}`);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=errors.js.map