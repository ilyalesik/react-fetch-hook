// @flow
import { useEffect, useState } from "react";

type TUsePromiseResult<T> = {
    data: ?T,
    isLoading: boolean,
    error: mixed
};

export function usePromise<T, I: $ReadOnlyArray<mixed>>(
    callFunction: ?(...args: I) => Promise<T>,
    ...inputs: I
): TUsePromiseResult<T> {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState();

    const call = () => {
        if (!callFunction) {
            return;
        }
        setLoading(true);
        callFunction(...inputs)
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    useEffect(call, [...inputs]);

    return {
        data,
        isLoading,
        error
    };
}
