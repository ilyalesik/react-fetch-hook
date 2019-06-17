import React from "react";
import ReactDOM from "react-dom";
import useFetch from "../../index";
import InfiniteScroll from "react-infinite-scroller";
import usePaginatedRequest from "../../usePaginatedRequest";

const searchRepositories = ({searchString}) => async ({offset, limit}) => {
    const response = await fetch(`https://api.github.com/search/repositories?q=${searchString}&sort=stars&order=desc&page=${parseInt(offset / limit)}&per_page=${limit}`);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const result = await response.json();
    return result.items;
};

const App = () => {
    const [searchString, setSearchString] = React.useState("");

    const result = usePaginatedRequest(
        searchRepositories({searchString}),
        100,
        searchString);

    console.log(result.data);

    return <div>
        <input value={searchString} onChange={(e) => setSearchString(e.target.value)} />
        <ul>
            <InfiniteScroll
                pageStart={0}
                loadMore={result.loadMore}
                hasMore={result.hasMore}
                loader={<div />}>
                    {result.data && result.data.map((item) => (
                        <li key={item.id}>{item.name} ({item.stargazers_count})</li>
                    ))}
            </InfiniteScroll>
        </ul>
    </div>
};


if (root) {
    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}
