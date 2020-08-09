const remark = require("remark");
const remarkHTML = require("remark-html");
const fs = require("fs");
const glob = require("glob");
const shiki = require("shiki");
const { JSDOM } = require("jsdom");

(async () => {
  const syntaxHighlighter = await shiki.getHighlighter({ theme: "light_plus" });

  for (const path of glob.sync("**/*.md", { ignore: ["node_modules/**"] })) {
    const text = fs.readFileSync(path, "utf8");
    const markdown = `<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Website without a Static Website Generator</title>
<header>

# My Website without a Static Website Generator

</header>
<main>

${text}

</main>
    `;
    const html = remark().use(remarkHTML).processSync(markdown).contents;
    const dom = new JSDOM(html);
    const document = dom.window.document;
    for (const codeBlock of document.querySelectorAll(
      `code[class^="language-"]`
    )) {
      codeBlock.parentElement.outerHTML = syntaxHighlighter.codeToHtml(
        codeBlock.textContent,
        codeBlock.className.slice("language-".length)
      );
    }
    fs.writeFileSync(
      `${path.slice(0, path.length - ".md".length)}.html`,
      dom.serialize()
    );
  }
})();
