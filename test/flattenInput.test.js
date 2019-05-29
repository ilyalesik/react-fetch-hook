import flattenInput from "../utils/flattenInput";

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

    it("with URL instance", () => {
        const url = new URL("https://google.com");
        url.search = new URLSearchParams({ a: "aaa", b: "bbb" }).toString();
        const result = flattenInput(url, { x: 1 });
        expect(result).toMatchObject([
            "https://google.com/?a=aaa&b=bbb",
            "x",
            1
        ]);
    });
});
