
eslint-plugin-no-lookahead-lookbehind-regexp
==============================
<img src="https://github.com/JonasBa/eslint-plugin-no-lookahead-lookbehind-regexp/blob/d42144e58aa0e428b0ad0d3bd43b070b835e07b0/example.png?raw=true" width="70%"/>

Lint the use of lookahead and lookbehind regexp expression. The expression is problematic, as compiling it in an unsupported browser will throw an error. The plugin handles both [literal and constructor notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp#literal_notation_and_constructor).

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

### Contributing

Be respectful, contributions of all sorts are well appreciated. If you have an issue with the package, file a descriptive issue with a reproducible case (if possible ofc). In case you want to improve the package or have ideas, file an issue before submitting a PR to avoid frustration in case we do not want to adopt the changes. Keep it positive ✌️
