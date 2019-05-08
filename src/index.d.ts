
interface FetchResult<T> {
    data?: T,
    isLoading: boolean,
    error?: any
}

interface HookOptions extends RequestInit {
    depends?: Array<any>
}

interface HookOptionsWithFormatter<T> extends HookOptions {
    formatter(response: Response): Promise<T>
}

export function useFetch<T>(path: RequestInfo,
                     options?: HookOptions | HookOptionsWithFormatter<T>,
                     specialOptions?: HookOptions): FetchResult<T>;

type requestFunction<T> = (params: {
    limit: number,
    offset: number,
}) => Promise<Array<T>>

export function usePaginatedRequest<T>(request: requestFunction<T>, limit: number): {
    data: Array<T>,
    loadMore?: () => any,
    hasMore: boolean,
};

type TUsePromiseResult<T> = {
    data?: T,
    isLoading: boolean,
    error: any,
};
export function flattenInput(...inputs: Array<any>): Array<any>;
export function usePromise<T, I extends Array<any>>(callFunction?: (...args: I) => Promise<T>, ...inputs: I): TUsePromiseResult<T>;
