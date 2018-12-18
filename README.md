# react-fetch-hook

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

