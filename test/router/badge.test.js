const { isText, isBinary, getEncoding } = require("istextorbinary");
const { build } = require("../helper");

const app = build();

const navigationUrl = "/badge/navigation";

describe("'/badge' test bed", () => {
  test("'/navigation' without all query parameter", async () => {
    const response = await app.inject({
      url: navigationUrl,
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(parsed).toEqual({
      message:
        'Parameter "badgeType" tidak valid, diharapkan "next" atau "previous".',
    });
  });

  test("'/navigation' without 'text' query parameter", async () => {
    const response = await app.inject({
      url: navigationUrl,
      query: {
        badgeType: "next",
      },
    });
    const parsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(parsed).toEqual({
      message: "Paramter text tidak boleh kosong !",
    });
  });

  test("'/navigation' with all query parameter, should be passed", async () => {
    const response = await app.inject({
      url: navigationUrl,
      query: {
        badgeType: "next",
        text: "Hello World",
      },
    });

    expect(response.headers["content-type"]).toBe("image/png");
    expect(isBinary(null, response.body)).toBeTruthy();
    expect(isText(null, response.body)).not.toBeTruthy();
  });
});
