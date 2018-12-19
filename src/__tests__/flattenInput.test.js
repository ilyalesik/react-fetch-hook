import { flattenInput } from "../usePromise";

describe("flattenInput", () => {
    it("simple", () => {
        expect(flattenInput(1, 2)).toMatchObject([1, 2]);
    });

    it("with array", () => {
        expect(flattenInput(1, [2, 3])).toMatchObject([1, 2, 3]);
    });

    it("with array recursive", () => {
        expect(flattenInput(1, [2, [3, 4]])).toMatchObject([1, 2, 3, 4]);
    });

    it("with object", () => {
        expect(flattenInput(1, { x: 1, y: 2 })).toMatchObject([1, "x", 1, "y", 2]);
    });

    it("with object recursive", () => {
        expect(flattenInput(1, { x: 1, y: 2, z: { x1: 3 } })).toMatchObject([1, "x", 1, "y", 2, "z", "x1", 3]);
    });
});
