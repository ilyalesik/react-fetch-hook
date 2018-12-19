# react-fetch-hook

React hook, which allows you to conveniently work with *fetch*. Good Flow support.

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

*useFetch* hook accepts the same arguments as *fetch* function.

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

You can pass any *fetch* options:
```javascript
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    method: "get",
    headers: {
        Accept: "application/json, application/xml, text/plain, text/html, *.*",
        "Content-Type": "application/json; charset=utf-8"
    }
});

```

You can pass *formatter* prop for using custom formatter function. Default is used *response => response.json()* formatter.
```javascript
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    formatter: (response) => response.text()
});

```
