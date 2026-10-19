import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NotFound } from "./components/NotFound";
import { PAGES } from "./pages";

/*
 * One <Route> per entry in PAGES. Adding a page means adding it to pages.ts only;
 * routing, the navbar and the footer sitemap all read from that one list.
 */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {PAGES.map((page) => (
          <Route key={page.path} path={page.path} element={<page.component />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
