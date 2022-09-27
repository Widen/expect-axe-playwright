---
'expect-axe-playwright': major
---

Rename toBeAccessible to toPassAxe (#24)

```diff
-expect(page).toBeAccessible()
+expect(page).toPassAxe()
```

The README explains why it's inaccurate to suggest that automated checks can
tell you if a page is accessible.

To update your code to be compatible with this major change, find and replace
all calls to `toBeAccessible` with `toPassAxe`.
