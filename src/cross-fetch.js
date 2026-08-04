const fetch = globalThis.fetch.bind(globalThis);

export default fetch;
export { fetch };
export const Headers = globalThis.Headers;
export const Request = globalThis.Request;
export const Response = globalThis.Response;
