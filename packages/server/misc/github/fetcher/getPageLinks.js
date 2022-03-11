const getPageLinks = (link) => {
  link = link.link || link.headers.link || "";

  const links = {};

  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri;
  });

  return links;
};

module.exports = getPageLinks;
