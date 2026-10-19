/// <reference types="vite/client" />

/* Raw imports used across the wiki: generated SVG figures and the team's own
   markdown write-ups. Declaring them here keeps `tsc -b` happy. */
declare module "*.svg?raw" {
  const content: string;
  export default content;
}
declare module "*.md?raw" {
  const content: string;
  export default content;
}
