declare namespace usePaginatedRequest {
    export type requestFunction<T> = (params: {
        limit: number,
        offset: number,
    }) => Promise<Array<T>>
}

declare function usePaginatedRequest<T>(request: usePaginatedRequest.requestFunction<T>, limit: number, ...depends: Array<any>): {
    data: Array<T>,
    loadMore?: () => any,
    hasMore: boolean,
};

export = usePaginatedRequest;
