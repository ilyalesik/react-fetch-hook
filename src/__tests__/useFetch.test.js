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
            return result.data && result.data.data;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(container).toHaveTextContent("12345");
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
        const formatterMock = jest.fn();
        formatterMock.mockReturnValueOnce("xxx");

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, formatter: formatterMock });
            return result.data;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(formatterMock.mock.calls.length).toEqual(1);
            expect(container).toHaveTextContent("xxx");
            expect(fetch.mock.calls[0][0]).toEqual("https://google.com");
            expect(fetch.mock.calls[0][1]).toMatchObject({ ...options });
        });
    });

    it("call with url, options with preventCallFetch", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, preventCallFetch: true });
            return <div>{result.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(0);
        });
    });

    it("error on throw error", async () => {
        fetch.mockReject(new Error("fake error message"));

        const Component = () => {
            const result = useFetch("https://google.com");
            return (result.error && result.error.message) || "text";
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(container).toHaveTextContent("fake error message");
            expect(fetch.mock.calls[0][0]).toEqual("https://google.com");
        });
    });
});
