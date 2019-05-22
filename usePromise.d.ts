
declare namespace usePromise {
    export type TUsePromiseResult<T> = {
        data?: T,
        isLoading: boolean,
        error: any,
    };
}

declare function usePromise<T, I extends Array<any>>(callFunction?: (...args: I) => Promise<T>, ...inputs: I): usePromise.TUsePromiseResult<T>;

export = usePromise;
