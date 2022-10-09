# react-fetch-hook

[![CircleCI](https://circleci.com/gh/ilyalesik/react-fetch-hook.svg?style=shield)](https://circleci.com/gh/ilyalesik/react-fetch-hook)
[![npm version](https://img.shields.io/npm/v/react-fetch-hook.svg)](https://www.npmjs.com/package/react-fetch-hook)
[![npm downloads](https://img.shields.io/npm/dt/react-fetch-hook.svg)](https://www.npmjs.com/package/react-fetch-hook)

React hook for conveniently use Fetch API.

* **Tiny** (556 B). Calculated by [size-limit](https://github.com/ai/size-limit)
* Both **Flow** and **TypeScript** types included

```javascript
import React from "react";
import useFetch from "react-fetch-hook";

const Component = () => {
  const { isLoading, data } = useFetch("https://swapi.co/api/people/1");

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <UserProfile {...data} />
  );
};

```

*useFetch* accepts the same arguments as *fetch* function.

## Installation

Install it with yarn:

```
yarn add react-fetch-hook
```

Or with npm:

```
npm i react-fetch-hook --save
```

## Usage

### Custom formatter

Default is `response => response.json()` formatter. You can pass custom formatter:

```javascript
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    formatter: (response) => response.text()
});

```

### Error handling

The `useFetch` hook returns an `error` field at any fetch exception.
The `error` field extends [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
and has `status` and `statusText` fields equal to [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

```javascript
...

const Component = () => {
  const { isLoading, data, error } = useFetch("https://swapi.co/api/people/1");

  if (error) {
    return <div>
      <p>Code: ${error.status}</p>
      <p>Message: ${error.statusText}</p>
    </div>
  }

  ...
};

```

### Abort request

The `useFetch` hook returns an `abort()` function that can be implemented whenever you need to cancel the request.
You can pass custom option: `{abortController: true}` to use this funcionality.
 `abort` implements the Abort Controller Interface [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
 You can see it in codesandbox-> [Code](https://codesandbox.io/s/react-fetch-hook-basic-forked-zb820v)

```javascript
...

const Component = () => {

  const defaultUrl = "https://swapi.dev/api/people/1";
  const [url, useUrl] = useState(defaultUrl);
  const [fetchUrl, useFetchUrl] = useState(defaultUrl);


 const { isLoading, data, abort } = useFetch(fetchUrl, {
    abortController: true,
  });

  const handleOnClick = (event) => {
    event.preventDefault();
    console.log("Fetching...");
    useFetchUrl(url);
  };

  return (
    <div>
      <input
        id="url"
        type="text"
        name="url"
        onChange={(event) => useUrl(event.target.value)}
        placeholder={"Url to fetch"}
        value={url}
      />
      <button onClick={handleOnClick}>Fecth Url</button>
      <button onClick={() => abort()}>Abort</button>
      <p>isLoading: {(isLoading && "true") || "false"}</p>
      <p>Name: {data && data.name}</p>
    </div>
  );


  ...
};

```

### Multiple requests
Multiple `useFetch` in the same file/component supported:

```javascript
const result1 = useFetch("https://swapi.co/api/people/1");
const result2 = useFetch("https://swapi.co/api/people/2");

if (result1.isLoading && result2.isLoading) {
  return <div>Loading...</div>;
}

return <div>
    <UserProfile {...result1.data} />
    <UserProfile {...result2.data} />
</div>
```

### Depends
The request will not be called until all elements of `depends` array be truthy. Example:

```javascript
const {authToken} = useContext(authTokenContext);
const [someState, setSomeState] = useState(false);
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    depends: [!!authToken, someState] // don't call request, if haven't authToken OR someState: false
});

```
See [example](examples/depends).

### Re-call requests
If any element of `depends` changed, request will be re-call. For example, you can use [react-use-trigger](https://github.com/ilyalesik/react-use-trigger) for re-call the request:
```javascript
import createTrigger from "react-use-trigger";
import useTrigger from "react-use-trigger/useTrigger";

const requestTrigger = createTrigger();

export const Subscriber = () => {
    const requestTriggerValue = useTrigger(requestTrigger);

    const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
        depends: [requestTriggerValue]
    });

    return <div />;
}

export const Sender = () => {
    return <button onClick={() => {
        requestTrigger() // re-call request
    }}>Send</button>
}
```

### usePromise
For custom promised function.

```javascript
import React from "react";
import usePromise from "react-fetch-hook/usePromise";
import callPromise from "..."

const Component = () => {
  const { isLoading, data } = usePromise(() => callPromise(...params), [...params]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <UserProfile {...data} />
  );
};
```

## [Examples](examples)

* [Basic](examples/basic) - Just fetch data with `useFetch`.
* [Depends](examples/depends) - Usage `depends` option for refresh query.
* [Pagination](examples/pagination) - Usage `usePaginationRequest` for infinite scroll implementation.
* [Abort](examples/abort) - Usage `abortController:true` for aborting promises .

## API

### `useFetch`
Create a hook wrapper for `fetch` call.
```javascript
useFetch(
    path: RequestInfo,
    options?: {
        ...RequestOptions,
        formatter?: Response => Promise
        depends?: Array<boolean>
        abortController: Boolean
    },
    specialOptions?: {
        formatter?: Response => Promise
        depends?: Array<boolean>
    }
): TUseFetchResult
```
where `TUseFetchResult` is:
```javascript
{
    data: any,
    isLoading: boolean,
    error: any
    abort: any,
}
```

 `RequestInfo`, `RequestOptions` is [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) args.


### `usePromise`
```javascript
usePromise<T, I: $ReadOnlyArray<mixed>>(
    callFunction: ?(...args: I) => Promise<T>,
    ...inputs: I
): TUsePromiseResult<T>
```
where `TUsePromiseResult<T>` is
```javascript
type TUsePromiseResult<T> = {
    data: ?T,
    isLoading: boolean,
    error: mixed
    abort: mixed
}
```

### Experimental: `usePaginatedRequest`
⚠️ Warning: this method is experimental, API can be changed.

Create a paginated request.
```javascript
usePaginatedRequest = <T>(
    request: (params: { limit: number, offset: number }) => Promise<Array<T>>,
    limit: number,
    ...depends: Array<any>
): {
    data: Array<T>,
    loadMore?: () => mixed,
    hasMore: boolean
};
```

## Who Uses react-fetch-hook

### Open Source projects

* [react-figma](https://github.com/react-figma/react-figma)
* [awesome-web-animation](https://github.com/sergey-pimenov/awesome-web-animation)
* [redux-helpers](https://github.com/lecstor/redux-helpers)
* [flowmap.blue](https://github.com/FlowmapBlue/flowmap.blue)

### Companies

* [Redis Agency](https://redis.agency/)
* [Lessmess Agency](https://lessmess.agency)
* [BigDatr](https://bigdatr.com/)
* [Fabrique numérique des Ministères Sociaux](https://incubateur.social.gouv.fr/)

[See more](https://github.com/ilyalesik/react-fetch-hook/network/dependents)
