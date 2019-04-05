# react-fetch-hook

[![Build Status](https://travis-ci.org/ilyalesik/react-fetch-hook.svg?branch=master)](https://travis-ci.org/ilyalesik/react-fetch-hook)
[![npm version](https://img.shields.io/npm/v/react-fetch-hook.svg)](https://www.npmjs.com/package/react-fetch-hook)
[![npm downloads](https://img.shields.io/npm/dt/react-fetch-hook.svg)](https://www.npmjs.com/package/react-fetch-hook)

React hook for conveniently use Fetch API.

```javascript
import React from "react";
import { useFetch } from "react-fetch-hook";

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
    },
    specialOptions?: {
        depends?: Array<boolean>
    }
): TUseFetchResult
```
where `TUseFetchResult` is:
```javascript
type TUseFetchResult<T> = {
    data: any,
    isLoading: boolean,
    error: any
}
```
#### Options:
##### RequestInfo, RequestOptions
 `RequestInfo`, `RequestOptions` is [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) args.

##### formatter
`formatter` - optional formatter function. 
Default is `response => response.json()` formatter.
Example:
```javascript
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    formatter: (response) => response.text()
});

```

##### depends
The request will not be called until all elements of `depends` array be truthy. Example:

```javascript
const {authToken} = useContext(authTokenContext);
const [someState, setSomeState] = useState(false);
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    depends: [!!authToken, someState] //don't call request, if haven't authToken and someState: false
});

```

If any element of `depends` changed, request will be re-call. For example, you can use [react-use-trigger](https://github.com/ilyalesik/react-use-trigger) for re-call the request:
```javascript
import {createTrigger, useTrigger} from "react-use-trigger";

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

