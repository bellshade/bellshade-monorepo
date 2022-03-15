const { build } = require("../helper");
const { reposPath } = require("../../misc/github/config");

const app = build();

test("'/learning/guide' test bed, should be passed", async () => {
  const response = await app.inject({
    url: "/learning/guide",
  });
  const parsed = JSON.parse(response.body);

  expect(response.statusCode).toBe(200);
  expect(parsed).toEqual(reposPath);
});

describe("Logical test for parameter and query string", () => {
  test('Empty parameter for "/learning/tree"', async () => {
    const responseTree = await app.inject({
      url: `/learning/tree/`,
    });

    const parsedTree = JSON.parse(responseTree.body);

    expect(responseTree.statusCode).toBe(400);
    expect(parsedTree).toEqual({
      message: 'Diperlukan parameter "repo"',
    });
  });

  test('Empty path query string and repo parameter for "/learning/content"', async () => {
    const responseContent = await app.inject({
      url: `/learning/content/`,
    });

    const parsedContent = JSON.parse(responseContent.body);

    expect(responseContent.statusCode).toBe(400);
    expect(parsedContent).toEqual({
      message: 'Diperlukan parameter "repo" dan query string "path"',
    });
  });

  test.each([{ repo: "js" }, { repo: "php" }, { repo: "py" }, { repo: "go" }])(
    'Check if badgeType "$repo" is invalid for "/learning/tree" and "/learning/content"',
    async ({ repo }) => {
      const responseTree = await app.inject({
        url: `/learning/tree/${repo}`,
      });
      const responseContent = await app.inject({
        url: `/learning/content/${repo}`,
        query: {
          path: "filler",
        },
      });

      const parsedTree = JSON.parse(responseTree.body);
      const parsedGuide = JSON.parse(responseContent.body);

      const repoNamesOnly = reposPath.map(({ repo }) => repo);
      const itShouldBe = {
        message: `Parameter repo yang diberikan tidak valid, value harus berupa ${repoNamesOnly
          .map((repo) => `"${repo}"`)
          .join(", ")}.`,
      };

      expect(responseTree.statusCode).toBe(400);
      expect(responseContent.statusCode).toBe(400);

      expect(parsedTree).toEqual(itShouldBe);
      expect(parsedGuide).toEqual(itShouldBe);
    }
  );
});
