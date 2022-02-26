const { reposPath } = require("../config");
const { getTree } = require("../fetcher");
const { octokit } = require("../../helpers");

const getStructureAndFilesContent = () =>
  Promise.all(
    reposPath.map(async (repoData) => {
      const gitTree = await getTree(repoData.repo, "HEAD");

      const tests = Object.values(repoData.materi);

      const tree = gitTree.tree.filter(({ path }) =>
        tests.some((test) => path.startsWith(test))
      );

      const contents = await Promise.all(
        tree
          .filter(({ type }) => type === "blob")
          .map(async (fileData) => {
            const file = await octokit.request(fileData.url);
            const content = Buffer.from(file.data.content, file.data.encoding);

            return {
              path: fileData.path,
              content,
            };
          })
      );

      const data = tree.map((data) => {
        const content = contents.find(({ path }) => path === data.path);

        if (!content)
          return {
            path: data.path,
            type: "directory",
          };

        return {
          path: data.path,
          type: "file",
          content: content.content,
        };
      });

      return {
        data,
        repo: repoData.repo,
      };
    })
  );

module.exports = getStructureAndFilesContent;
