import React from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";


const App = () => {
    const {isLoading, data, error} = useFetch(`https://swapi.co/api/people/1`);

    console.log(isLoading, data, error && error.status);

    return <div>
        <p>isLoading: {isLoading && "true" || "false"}</p>
        <p>Name: {data && data.name}</p>
    </div>
};


if (root) {
    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}
