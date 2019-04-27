// @flow
import { useState, useRef, useEffect } from "react";

export const usePaginatedRequest = <T>(
    request: (params: { limit: number, offset: number }) => Promise<Array<T>>,
    limit: number
): {
    data: Array<T>,
    loadMore?: () => mixed,
    hasMore: boolean
} => {
    const [data, setData] = useState([]);
    const currentUpdate = useRef();
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreRef = useRef(() => {});

    useEffect(
        () => {
            loadMoreRef.current = async () => {
                if (currentUpdate.current) {
                    await currentUpdate.current;
                }
                if (hasMore) {
                    setOffset(offset + limit);
                }
            };

            const update = async () => {
                const result = await request({ limit, offset });
                setHasMore(result.length === limit);
                setData(prev => [...prev, ...result]);
            };
            currentUpdate.current = update();
        },
        [offset]
    );

    return {
        data,
        loadMore: loadMoreRef.current || (() => {}),
        hasMore
    };
};
