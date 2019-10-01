import React from "react";
import { render, wait } from "react-testing-library";
import useFetch from "../index";

describe("useFetch", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("call with only url", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));

        const Component = () => {
            const result = useFetch("https://google.com");
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(container).toHaveTextContent("12345");
            expect(fetch.mock.calls[0][0]).toEqual("https://google.com");
        });
    });

    it("isLoading by default", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));

        const Component = () => {
            const result = useFetch("https://google.com");
            return <div>{result.isLoading && "test"}</div>;
        };

        const { container, rerender } = render(<Component />);
        expect(container).toHaveTextContent("test");
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
            return <div>{result.data}</div>;
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

    it("call with url, options, special options with formatter", async () => {
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
            const result = useFetch("https://google.com", { ...options }, { formatter: formatterMock});
            return <div>{result.data}</div>;
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

    it("call with url, options with preventCallFetch: false and depends", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, depends: ["xxx"], preventCallFetch: false });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
        });
    });

    it("call with url, options with depends", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, depends: [true, false] });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(0);
        });
    });

    it("call with url, options with depends never set isLoading", async () => {
        const isLoadingWatcher = jest.fn();
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, depends: [false] });
            const isLoading = result.isLoading;
            React.useEffect(() => {
                if (isLoading) {
                    isLoadingWatcher();
                }
            }, [isLoading])
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(isLoadingWatcher.mock.calls.length).toEqual(0);
        });
    });

    it("call with url, options with depends at next arg", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const fetchParams = ["https://google.com", options];

        const Component = () => {
            const result = useFetch(...fetchParams, { depends: [true, false] });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(0);
        });
    });

    it("call with url, options with depends: [true] at next arg", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const fetchParams = ["https://google.com", options];

        const Component = () => {
            const result = useFetch(...fetchParams, { depends: [true] });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
        });
    });

    it("call with url, options with depends with empty string", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, depends: [""] });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(0);
        });
    });

    it("call with url, options with empty depends", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, depends: [] });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
        });
    });

    it("call with url, options with all true depends", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));
        const options = {
            headers: {
                Accept: "application/json, application/xml, text/plain, text/html, *.*",
                "Content-Type": "application/json; charset=utf-8"
            }
        };

        const Component = () => {
            const result = useFetch("https://google.com", { ...options, depends: [true, true] });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
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

    it("call with URL", async () => {
        fetch.mockResponse(JSON.stringify({ data: "12345" }));

        const url = new URL("https://google.com");

        url.search = new URLSearchParams({a: 1, b: 2}).toString();

        const Component = () => {
            const result = useFetch(url, {
                depends: ["1", 1]
            });
            return <div>{result.data && result.data.data}</div>;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            rerender(<Component />);
        });

        await wait(() => {
            rerender(<Component />);

            expect(fetch.mock.calls.length).toEqual(1);
            expect(container).toHaveTextContent("12345");
            expect(fetch.mock.calls[0][0]).toMatchObject(url);
        });
    });
});
