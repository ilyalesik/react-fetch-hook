import React from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";


const App = () => {
    const [isTimeoutEnded, setTimeoutEnded] = React.useState(false);
    const {isLoading, data} = useFetch(`https://swapi.co/api/people/1`,{
        depends: [isTimeoutEnded]
    });

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            console.log("setTimeoutEnded: true");
            setTimeoutEnded(true);
        }, 5000);
        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

    console.log(isLoading, data);

    return <div>
        <p>isTimeoutEnded: {isTimeoutEnded && "true" || "false"}</p>
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
