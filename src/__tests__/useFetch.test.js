import React from "react";
import { render, wait } from "react-testing-library";
import { useFetch } from "../useFetch";

describe("useFetch", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("call with only url", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));

        const Component = () => {
            const result = useFetch("https://google.com");
            return <div>{result.isLoading}</div>;
        };

        const { rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(fetch.mock.calls[0][0]).toEqual("https://google.com");
        });
    });

    it("call with url and options", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options });
            return <div>{result.isLoading}</div>;
        };

        const { rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(fetch.mock.calls[0][0]).toEqual("https://google.com");
            expect(fetch.mock.calls[0][1]).toMatchObject({ ...options });
        });
    });

    it("call with url, options with formatter", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, formatter: response => response.text() });
            return <div>{result.isLoading}</div>;
        };

        const { rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(fetch.mock.calls[0][0]).toEqual("https://google.com");
            expect(fetch.mock.calls[0][1]).toMatchObject({ ...options });
        });
    });
});
