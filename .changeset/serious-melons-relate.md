---
'expect-axe-playwright': major
---

Remove support for element handles. Please use locators instead.

```diff
-expect(page.$('button')).toBeAccessible()
+expect(page.locator('button')).toBeAccessible()
```
