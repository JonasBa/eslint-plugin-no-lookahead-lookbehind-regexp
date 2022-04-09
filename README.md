# eslint-plugin-no-lookahead-lookbehind-regexp

<img src="https://github.com/JonasBa/eslint-plugin-no-lookahead-lookbehind-regexp/blob/main/example.gif?raw=true" width="70%"/>

Lint the use of lookahead and lookbehind regexp expression. The expression is problematic, as compiling it in an unsupported browser will throw an error and possibly crash your browser. The plugin handles both Regexp [literal and constructor notations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp#literal_notation_and_constructor).

## 1. Install

```bash
npm install --save-dev eslint-plugin-no-lookahead-lookbehind-regexp
```

## 2. Add plugin to your ESlint configuration

#### `.eslintrc.json`

```diff
   {
+    "extends": ["plugin:no-lookahead-lookbehind-regexp/recommended"],
+    "env": {
+      "browser": true
+    },
   }
```

## 3. Configure Browser Targets

We use [browserslist](https://github.com/browserslist/browserslist) to resolve browser support - **if no browserslist config** is found, then the use of lookahead and lookbehind regexp group will always throw an error!

### `package.json`

```diff
   {
+    "browserslist": [
+      "defaults"
+    ]
  }
```

## 4. Customizing rules

By default, the plugin will report on all lookahead and lookbehind regexp as well as their negative counterparts. To enable only individual rules like erroring only on lookbehind expressions, you can pass a list of rules that you wish to enable as options in your eslint. **Note that once a single rule is passed as a configuration option, all of the other rules are disabled by default and you are in full control.**

```js
rules: {
   'no-lookahead-lookbehind-regexp/no-lookahead-lookbehind-regexp': [
      'error',
      'no-lookahead',
      'no-lookbehind',
      'no-negative-lookahead',
      'no-negative-lookbehind',
   ],
}
```

As an example, passing both no-lookbehind and no-negative-lookbehind as options will cause the plugin to error on all lookbehind and negative lookbehind expressions, but it will not cause it to report errors on lookahead or negative lookahead expressions.

```js
rules: {
   'no-lookahead-lookbehind-regexp/no-lookahead-lookbehind-regexp': [
      'error',
      'no-lookbehind',
      'no-negative-lookbehind',
   ],
}
```

## Contributing

Be respectful, contributions of all sorts are well appreciated. If you have an issue with the package, file a descriptive issue with a reproducible case (if possible ofc). In case you want to improve the package or have ideas, file an issue before submitting a PR to avoid frustration in case we do not want to adopt the changes. Keep it positive ✌️
