---
name: Fix Google Translate removeChild error
overview: Prevent "Failed to execute 'removeChild' on 'Node'" when users translate the page with Chrome or the Google Translate widget by applying the React team's DOM monkey-patch.
todos:
  - id: add-patch-component
    content: Add GoogleTranslatePatch client component that patches Node.prototype.removeChild and insertBefore
    status: pending
  - id: mount-patch-in-layout
    content: Mount the patch component in root layout so it runs once on app load
    status: pending
isProject: false
---

# Fix Google Translate removeChild error

## Problem

When users translate the page (Chrome "Translate to English" or Google Translate widget), you get:

```text
Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
```

**Cause:** Google Translate replaces text nodes with `<font>` elements. React still holds references to the old nodes. On the next React update, it calls `removeChild` on a node that is no longer in the DOM tree, so the browser throws.

## Solution: DOM monkey-patch (React team workaround)

Dan Gaearon (React core) recommended [this workaround](https://github.com/facebook/react/issues/11538#issuecomment-417504600): patch `Node.prototype.removeChild` and `Node.prototype.insertBefore` so that when the node is not actually a child (e.g. because Google Translate moved it), the call no-ops instead of throwing. React will log to console but the app won’t crash.

Trade-off: after translation, some React updates may not fully apply (e.g. new text might not appear in a few places). For a mostly static marketing site this is usually acceptable.

## Implementation

### 1. Add a client component that applies the patch

Create [src/components/GoogleTranslatePatch.tsx](src/components/GoogleTranslatePatch.tsx):

- `"use client"`.
- No UI; component returns `null`.
- In `useEffect` (runs once on mount):
  - If `typeof Node === 'function' && Node.prototype`:
    - **removeChild**: save `Node.prototype.removeChild`, replace with a function that checks `child.parentNode !== this`; if true, optionally `console.error` and return `child` without removing; otherwise call the original.
    - **insertBefore**: save `Node.prototype.insertBefore`, replace with a function that checks `referenceNode && referenceNode.parentNode !== this`; if true, optionally `console.error` and return `newNode`; otherwise call the original.
- Use the exact logic from the React issue comment (no extra loops or DOM changes).

### 2. Mount the patch in the root layout

In [src/app/layout.tsx](src/app/layout.tsx):

- Import `GoogleTranslatePatch`.
- Render it once inside `<body>`, e.g. right after `<SEOJsonLD />` or before `{children}`, so the patch runs as soon as the client tree mounts and is active before any user-triggered re-renders after translation.

### 3. No Google Translate widget script in repo

The codebase does not currently load the Google Translate widget; the error occurs when users use **browser translation** (e.g. Chrome’s “Translate to English”). The same patch prevents crashes in both cases. If you later add the official widget script, no extra change is needed for this fix.

## Optional hardening (if crashes persist)

- **Wrap conditional text in `<span>`:** Patterns like `{condition && 'Text'}` or ternaries that render different numbers of text nodes can still trigger the error in edge cases. Wrapping the text in a `<span>` keeps the node React expects in the DOM when Translate replaces only the text inside. Apply only in components that re-render often (e.g. hero, header) if needed.
- **Error boundary:** As a last resort, wrap the app (or main content) in an error boundary that catches the error and re-renders the subtree. Users may see a brief flicker; state in that subtree is lost. Prefer the monkey-patch first.

## Files to add


| File                                                                               | Purpose                                                                   |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [src/components/GoogleTranslatePatch.tsx](src/components/GoogleTranslatePatch.tsx) | Client component that applies removeChild/insertBefore patch in useEffect |


## Files to modify


| File                                     | Change                                                       |
| ---------------------------------------- | ------------------------------------------------------------ |
| [src/app/layout.tsx](src/app/layout.tsx) | Import and render `<GoogleTranslatePatch />` inside `<body>` |


## Reference

- React issue and workaround: [facebook/react#11538 (comment)](https://github.com/facebook/react/issues/11538#issuecomment-417504600)
- Explanation of the bug and options: [Everything about Google Translate crashing React](https://martijnhols.nl/blog/everything-about-google-translate-crashing-react)

