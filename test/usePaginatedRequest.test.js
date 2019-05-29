import React from "react";
import { render, wait, fireEvent, cleanup } from "react-testing-library";
import usePaginatedRequest from "../usePaginatedRequest";

const ChildComponent = props => {
    return (
        <div>
            {props.data.map(item => (
                <div>{item}</div>
            ))}
            {props.hasMore && <div>hasMore</div>}
            <button data-testid="trigger" onClick={props.loadMore} />
        </div>
    );
};

describe("usePaginatedRequest", () => {
    afterEach(cleanup);

    it("first load", async () => {
        const request = jest.fn(() => Promise.resolve([1, 2]));

        const Component = () => {
            const { data, hasMore, loadMore } = usePaginatedRequest(request, 2);

            return <ChildComponent data={data} hasMore={hasMore} loadMore={loadMore} />;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            expect(container).toMatchSnapshot();
        });

        await wait(() => {
            rerender(<Component />);
            expect(request.mock.calls.length).toBe(1);
        });
    });

    it("first load (expect hasMore - false)", async () => {
        const request = jest.fn(() => Promise.resolve([1]));

        const Component = () => {
            const { data, hasMore, loadMore } = usePaginatedRequest(request, 2);

            return <ChildComponent data={data} hasMore={hasMore} loadMore={loadMore} />;
        };

        const { container, rerender } = render(<Component />);

        await wait(() => {
            expect(container).toMatchSnapshot();
        });

        await wait(() => {
            rerender(<Component />);
            expect(request.mock.calls.length).toBe(1);
        });
    });

    it("call loadMore", async () => {
        const request = jest.fn();
        request.mockReturnValueOnce(Promise.resolve([1, 2])).mockReturnValueOnce(Promise.resolve([3, 4]));

        const Component = () => {
            const { data, hasMore, loadMore } = usePaginatedRequest(request, 2);

            return <ChildComponent data={data} hasMore={hasMore} loadMore={loadMore} />;
        };

        const { container, rerender, getByTestId } = render(<Component />);

        await wait(() => {
            fireEvent.click(getByTestId("trigger"));
        });

        await wait(() => {
            rerender(<Component />);
        });

        await wait(() => {
            expect(container).toMatchSnapshot();
            expect(request.mock.calls.length).toBe(2);
        });
    });

    it("call loadMore (expect hasMore - false)", async () => {
        const request = jest.fn();
        request.mockReturnValueOnce(Promise.resolve([1, 2])).mockReturnValueOnce(Promise.resolve([3]));

        const Component = () => {
            const { data, hasMore, loadMore } = usePaginatedRequest(request, 2);

            return <ChildComponent data={data} hasMore={hasMore} loadMore={loadMore} />;
        };

        const { container, rerender, getByTestId } = render(<Component />);

        await wait(() => {
            fireEvent.click(getByTestId("trigger"));
        });

        await wait(() => {
            rerender(<Component />);
        });

        await wait(() => {
            expect(container).toMatchSnapshot();
            expect(request.mock.calls.length).toBe(2);
        });
    });
});
