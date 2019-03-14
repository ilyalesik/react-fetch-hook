// @flow
import { useEffect, useState, useMemo } from "react";

type TUsePromiseResult<T> = {
    data: ?T,
    isLoading: boolean,
    error: mixed
};

export const flattenInput = (...inputs: $ReadOnlyArray<mixed>): $ReadOnlyArray<mixed> => {
    return inputs.reduce((accumulator, input) => {
        if (input instanceof Array) {
            return [...accumulator, ...flattenInput(...input)];
        }
        if (input instanceof Object) {
            const keys = Object.keys(input);
            return [...accumulator, ...flattenInput(...keys.reduce((a, k) => [...a, k, input[k]], []))];
        }
        if (input instanceof URL) {
            return [
                ...accumulator,
                ...flattenInput(
                    input.hash,
                    input.host,
                    input.hostname,
                    input.href,
                    input.origin,
                    input.password,
                    input.pathname,
                    input.port,
                    input.protocol,
                    input.search,
                    input.username
                )
            ];
        }
        return [...accumulator, input];
    }, []);
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
                setError(undefined);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    useEffect(call, [...flattenInput(inputs)]);

    return {
        data,
        isLoading,
        error
    };
}
