# You Might Not Need a Static Website Generator

👍

```js
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
  fs.writeFileSync(`${path.slice(0, path.length - ".md".length)}.html`, html);
}
```
