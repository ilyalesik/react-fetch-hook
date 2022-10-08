import React, { useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";

const App = () => {

  const defaultUrl = "https://swapi.dev/api/people/1";
  const [url, useUrl] = useState(defaultUrl);

  const onSubmit = (event) => {
    console.log("Submitting...");
    event.preventDefault(); // 👈️ prevent page refresh



    console.log(isLoading, data, error && error.status);

    // 👇️ clear all input values in the form
    useUrl("");
  };
  const { isLoading, data, error } = useFetch(url);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label for="url">URL to fetch:</label>
        <input
          id="url"
          type="text"
          name="url"
          defaultValue={defaultUrl}
          onChange={(event) => useUrl(event.target.value)}
          placeholder={"Url to fetch"}
          value={url}
        />
        <button type="submit" >
          Fecth Url
        </button>
      </form>
     <p>isLoading: {(isLoading && "true") || "false"}</p>
      <p>Name: {data && data.name}</p> 
    </div>
  );
};

if (root) {
  ReactDOM.render(<App />, document.getElementById("root"));
}
