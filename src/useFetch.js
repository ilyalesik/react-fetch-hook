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
        depends?: Array<mixed>
    },
    specialOptions?: {
        depends?: Array<mixed>
    }
): TUseFetchResult<T> {
    const defaultFormatter = response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    };
    const fetchInstance = formatter => (path, options, specialOptions) => {
        const { depends, preventCallFetch, ...otherOptions } = options || {};
        const _depends = (specialOptions && specialOptions.depends) || depends;
        const _preventCallFetch = _depends
            ? _depends.reduce((accumulator, currentValue) => accumulator || !currentValue, false)
            : preventCallFetch;
        if (_preventCallFetch) {
            return Promise.resolve();
        }
        return fetch(path, otherOptions).then((typeof formatter === "function" && formatter) || defaultFormatter);
    };
    if (options) {
        const { formatter, ...fetchOptions } = options;

        return usePromise((fetchInstance(formatter): any), path, fetchOptions, specialOptions);
    } else {
        return usePromise((fetchInstance(): any), path);
    }
}
