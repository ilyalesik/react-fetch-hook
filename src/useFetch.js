// @flow
import { usePromise } from "./usePromise";

type TUseFetchResult = {
    data: ?mixed,
    isLoading: boolean,
    error: mixed
};

export function useFetch(
    path: RequestInfo,
    options?: { ...RequestOptions, formatter?: Response => Promise<mixed> }
): TUseFetchResult {
    const defaultFormatter = response => response.json();
    const fetchInstance = formatter => (path, options) => {
        return fetch(path, options).then((typeof formatter === "function" && formatter) || defaultFormatter);
    };
    if (options) {
        const { formatter, ...fetchOptions } = options;

        return usePromise(fetchInstance(formatter), path, fetchOptions);
    } else {
        return usePromise(fetchInstance(), path);
    }
}
