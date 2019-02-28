// @flow

import {useFetch} from "../useFetch";

const Component = () => {
    const result = useFetch("some url");
};

const ComponentGenericUseFetch = () => {
    const result = useFetch<{some_field: string}>("some url");
    if (result.data) {
        (result.data.some_field: string);
    }

};
