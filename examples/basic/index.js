import React, { useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";

const App = () => {
  const defaultUrl = "https://swapi.dev/api/people/1";
  const [url, useUrl] = useState(defaultUrl);
  const [fetchUrl, useFetchUrl] = useState(defaultUrl);

  const { isLoading, data, error } = useFetch(fetchUrl);

  const handleOnClick = (event) => {
    useFetchUrl(event.target.url.value);
    event.preventDefault(); // 👈️ prevent page refresh
    // 👇️ clear all input values in the form
    useUrl("");
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

      <p>isLoading: {(isLoading && "true") || "false"}</p>
      <p>Name: {data && data.name}</p>
    </div>
  );
};

if (root) {
  ReactDOM.render(<App />, document.getElementById("root"));
}
