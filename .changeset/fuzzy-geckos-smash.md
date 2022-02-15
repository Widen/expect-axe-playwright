---
'expect-axe-playwright': major
---

Remove support for resolving iframes from element handles. Please use [`FrameLocator`s](https://playwright.dev/docs/api/class-framelocator) instead.

```diff
-expect(page.$('iframe')).toBeAccessible()
+expect(page.frameLocator('iframe')).toBeAccessible()
```
