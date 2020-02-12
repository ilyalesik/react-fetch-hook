
declare namespace useFetch {
    export interface UseFetchError extends Error {
        status: number,
        statusText: string
    }

    export interface FetchResult<T> {
        data?: T,
        isLoading: boolean,
        error?: UseFetchError
    }

    export interface HookOptions extends RequestInit {
        depends?: Array<any>
    }

    export interface HookOptionsWithFormatter<T> extends HookOptions {
        formatter(response: Response): Promise<T>
    }
}


declare function useFetch<T>(path: RequestInfo,
                     options?: useFetch.HookOptions | useFetch.HookOptionsWithFormatter<T>,
                     specialOptions?: useFetch.HookOptions): useFetch.FetchResult<T>;

export = useFetch;

