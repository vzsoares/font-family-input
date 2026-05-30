# Backlog

## StackBlitz doc showcase

Inspired by [TanStack Virtual](https://tanstack.com/virtual/latest).

**Approach:** store examples as full runnable Vite projects in the repo, embed via GitHub-backed StackBlitz iframes — no SDK needed.

```
https://stackblitz.com/github/vzsoares/font-family-input/tree/main/examples/react/basic?embed=1&file=src/App.tsx
```

**Steps:**
1. Add `examples/<framework>/basic/` directories — each a full Vite project using the published npm packages (doubles as integration tests).
2. Add a `<StackBlitzEmbed>` Vue component in `.vitepress/theme/` that renders the iframe + an "Open in StackBlitz" button.
3. Drop the embed into each framework guide page below the quick-start snippet.

**Frameworks to cover:** react, vue, svelte, solid, preact, html.

**Pros over SDK approach:**
- Examples are locally runnable → integration test for free.
- Zero JS overhead in docs — just an iframe pointing to GitHub.
- Updating an example = push a commit.
