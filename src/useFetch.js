// @flow
import { usePromise } from "./usePromise";

type TUseFetchResult<T> = {
    data: ?T,
    isLoading: boolean,
    error: mixed
};

export function useFetch<T>(
    path: RequestInfo,
    options?: {
        ...RequestOptions,
        formatter?: Response => Promise<T>,
        preventCallFetch?: boolean,
        depends?: Array<boolean>
    }
): TUseFetchResult<T> {
    const defaultFormatter = response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    };
    const fetchInstance = formatter => (path, options) => {
        const { depends, preventCallFetch, ...otherOptions } = options || {};
        const _preventCallFetch = depends
            ? depends.reduce((accumulator, currentValue) => accumulator || !currentValue, false)
            : preventCallFetch;
        if (_preventCallFetch) {
            return Promise.resolve();
        }
        return fetch(path, otherOptions).then((typeof formatter === "function" && formatter) || defaultFormatter);
    };
    if (options) {
        const { formatter, ...fetchOptions } = options;

        return usePromise((fetchInstance(formatter): any), path, fetchOptions);
    } else {
        return usePromise((fetchInstance(): any), path);
    }
}
