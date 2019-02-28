// @flow
import { usePromise } from "./usePromise";

type TUseFetchResult<T> = {
    data: ?T,
    isLoading: boolean,
    error: mixed
};

export function useFetch<T>(
    path: RequestInfo,
    options?: { ...RequestOptions, formatter?: Response => Promise<T> }
): TUseFetchResult<T> {
    const defaultFormatter = response => response.json();
    const fetchInstance = formatter => (path, options) => {
        return fetch(path, options).then((typeof formatter === "function" && formatter) || defaultFormatter);
    };
    if (options) {
        const { formatter, ...fetchOptions } = options;

        return usePromise((fetchInstance(formatter): any), path, fetchOptions);
    } else {
        return usePromise((fetchInstance(): any), path);
    }
}
