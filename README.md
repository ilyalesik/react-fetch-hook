# react-fetch-hook

[![Build Status](https://travis-ci.org/ilyalesik/react-fetch-hook.svg?branch=master)](https://travis-ci.org/ilyalesik/react-fetch-hook)
[![npm version](https://img.shields.io/npm/v/react-fetch-hook.svg)](https://www.npmjs.com/package/react-fetch-hook)
[![npm downloads](https://img.shields.io/npm/dt/react-fetch-hook.svg)](https://www.npmjs.com/package/react-fetch-hook)

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
### Custom formatter
You can pass *formatter* prop for using custom formatter function. Default is used *response => response.json()* formatter.
```javascript
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    formatter: (response) => response.text()
});

```
### Prevent call `fetch`
For prevent call fetch you can pass *preventCallFetch* prop:

```javascript
const {authToken} = useContext(authTokenContext);
const { isLoading, data } = useFetch("https://swapi.co/api/people/1", {
    preventCallFetch: !authToken //don't call request, if haven't authToken
});

```
Motivation: you can apply hooks only at top level of function. 
Calling hooks inside `if` or `for` statements, or change count of hooks may throw React error.
```javascript
// Potential сrash, because may call different count of hooks:
const {authToken} = useContext(authTokenContext);
if (!authToken) {
    return null;
}
const { isLoading, data } = useFetch("https://swapi.co/api/people/1");

```
