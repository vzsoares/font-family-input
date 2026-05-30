import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/font-family-input/",
  title: "font-family-input",
  description: "Composable, headless, virtualized font-family picker for the web.",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Preview", link: "/preview/", target: "_blank" },
      { text: "npm", link: "https://www.npmjs.com/org/font-family-input" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Philosophy", link: "/guide/philosophy" },
        ],
      },
      {
        text: "Packages",
        items: [
          { text: "@font-family-input/core", link: "/guide/core" },
          { text: "@font-family-input/react", link: "/guide/react" },
          { text: "@font-family-input/vue", link: "/guide/vue" },
          { text: "@font-family-input/svelte", link: "/guide/svelte" },
          { text: "@font-family-input/solid", link: "/guide/solid" },
          { text: "@font-family-input/preact", link: "/guide/preact" },
          { text: "@font-family-input/html", link: "/guide/html" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Font Providers", link: "/guide/providers" },
          { text: "Virtualization", link: "/guide/virtualization" },
          { text: "Accessibility", link: "/guide/accessibility" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/vzsoares/font-family-input" }],
  },
});
