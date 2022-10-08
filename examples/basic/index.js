import React, { useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";

const App = () => {
  const [url, useUrl] = useState();
  const defaultUrl = "https://swapi.dev/api/people/1";

  const onClick = (e) => {
    const { isLoading, data, error } = useFetch(url);
  };

  const onSubmit = () => {};

  console.log(isLoading, data, error && error.status);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          id="url_input"
          defaultValue={defaultUrl}
          placeholder={"Url to fetch"}
        ></input>
        <button type="submit" onClick={onClick}>
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
