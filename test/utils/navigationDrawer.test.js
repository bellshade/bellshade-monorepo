const { drawer, nextImg, prevImg } = require("../../router/badge/config");
const isSvg = require("is-svg");

describe("SVG Drawer function test bed", () => {
  const text = "Hello World";

  it("expect throw an error 'Text is Required'", () => {
    const error = new Error("Text is Required");

    expect(() => drawer()).toThrow(error);
    expect(() => drawer("")).toThrow(error);
  });

  it("expect throw an error 'Invalid Type'", () => {
    const error = new Error("Invalid Type");

    expect(() => drawer(text, "")).toThrow(error);
    expect(() => drawer(text, "up")).toThrow(error);
    expect(() => drawer(text, "down")).toThrow(error);
    expect(() => drawer(text, "left")).toThrow(error);
    expect(() => drawer(text, "right")).toThrow(error);
  });

  it("will be running on default type mode", () => {
    const result = drawer(text);

    expect(isSvg(result)).toBeTruthy();
    expect(result.includes(text.toUpperCase())).toBeTruthy();
    expect(result.includes(nextImg)).toBeTruthy();
  });

  it("will be running on previous type mode", () => {
    const result = drawer(text, "previous");

    expect(isSvg(result)).toBeTruthy();
    expect(result.includes(text.toUpperCase())).toBeTruthy();
    expect(result.includes(prevImg)).toBeTruthy();
  });
});
