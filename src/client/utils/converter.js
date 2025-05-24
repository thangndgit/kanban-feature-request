export const issueToElementStr = (type, issue) => {
  let tagName = "div";
  let innerText = "";
  let attrs = {};
  if (issue?.attributes) attrs = { ...issue.attributes };

  switch (type) {
    case "title":
      tagName = "title";
      innerText = issue;
      break;

    case "img":
      tagName = "img";
      attrs.src = issue.src;
      break;

    case "link":
      tagName = "a";
      attrs.href = issue.href;
      attrs.rel = issue.rel;
      innerText = issue.innerText;
      break;

    case "metaRobot":
      tagName = "meta";
      attrs.name = "robots";
      attrs.content = issue;
      break;

    case "description":
      tagName = "meta";
      attrs.name = "description";
      attrs.content = issue;
      break;

    case "h1":
      tagName = "h1";
      innerText = issue;
      break;

    case "h2":
      tagName = "h2";
      innerText = issue;
      break;

    case "h3":
      tagName = "h3";
      innerText = issue;
      break;

    case "viewport":
      tagName = "meta";
      attrs.name = "viewport";
      attrs.content = issue?.value;
      break;

    case "canonicalLink":
      tagName = "link";
      attrs.rel = "canonical";
      attrs.href = issue;
      break;

    case "metaOg":
      tagName = "meta";
      attrs.property = issue?.property;
      attrs.content = issue?.content;
      break;

    case "wordCount":
      return "Your page has " + issue + " words.";

    case "pageUrl":
      return issue;
  }

  const element = document.createElement(tagName);
  for (let key in attrs) {
    if (attrs[key]) element.setAttribute(key, attrs[key]);
  }
  if (innerText) element.innerText = innerText;

  return element.outerHTML;
};
