import React, { useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";

const App = () => {
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
};

if (root) {
  ReactDOM.render(<App />, document.getElementById("root"));
}
