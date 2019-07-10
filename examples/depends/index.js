import React from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";


const App = () => {
    const [counter, setCounter] = React.useState(false);
    const {isLoading, data} = useFetch(`http://worldtimeapi.org/api/timezone/Europe/London`,{
        depends: [counter]
    });

    React.useEffect(() => {
        const timeoutId = setInterval(() => {
            console.log("setTimeoutEnded: true");
            setCounter((counter) => counter + 1);
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

    console.log(isLoading, data);

    return <div>
        <p>counter: {counter}</p>
        <p>isLoading: {isLoading && "true" || "false"}</p>
        <p>UTC date time: {data && data.utc_datetime}</p>
    </div>
};


if (root) {
    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}
