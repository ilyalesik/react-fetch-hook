// @flow
import { usePromise } from "./usePromise";

type TUseFetchResult = {
    data: ?mixed,
    isLoading: boolean,
    error: mixed
};

export function useFetch(
    path: RequestInfo,
    options?: { ...RequestOptions, formatter: Response => Promise<mixed> }
): TUseFetchResult {
    const defaultFormatter = response => response.json();
    const fetchInstance = (path, options) => {
        return fetch(path, options).then((options && options.formatter) || defaultFormatter);
    };
    return usePromise(fetchInstance, path, options);
}
