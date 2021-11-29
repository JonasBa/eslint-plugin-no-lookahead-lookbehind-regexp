eslint-plugin-no-lookahead-lookbehind-regexp
==============================

Lint the use of lookahead and lookbehind regexp expression. The expression is problematic, as compiling it in an unsupported browser will throw an error. 

### 1. Install

```bash
npm install --save-dev eslint-plugin-no-lookahead-lookbehind-regexp
```

### 2. Add plugin to your ESlint configuration

#### `.eslintrc.json`

```diff
   {
+    "extends": ["plugin:no-lookahead-lookbehind-regexp/recommended"],
+    "env": {
+      "browser": true
+    },
   }
```

### 3. Configure Browser Targets

We use [browserslist](https://github.com/browserslist/browserslist) to resolve browser support - **if no browserslist config** is found, then the use of lookahead and lookbehind regexp group will always throw an error!

### `package.json`

```diff
   {
+    "browserslist": [
+      "defaults"
+    ]
  }
```
