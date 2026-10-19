import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Bootstrap first, then our own styles, so page CSS always wins on specificity ties.
import "bootstrap/dist/css/bootstrap.min.css";
import "./global.css";

import { App } from "./App";

/*
 * iGEM serves the wiki from https://2026.igem.wiki/<team>/, so react-router needs
 * the same base path the Vite build used. import.meta.env.BASE_URL is exactly that
 * value (see `base` in vite.config.ts), with a trailing slash that BrowserRouter
 * does not want.
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
