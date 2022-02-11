---
'expect-axe-playwright': major
---

Make `matchers` the default export.

```diff
-import { matchers } from 'expect-axe-playwright'
+import matchers from 'expect-axe-playwright'
```
