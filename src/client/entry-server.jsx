import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";

export function render({ path }) {
  const cache = createCache();

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StyleProvider cache={cache}>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </StyleProvider>
    </React.StrictMode>
  );

  const styleText = extractStyle(cache);

  return { html, head: styleText };
}
