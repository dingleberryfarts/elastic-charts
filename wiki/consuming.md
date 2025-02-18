# Consuming Elastic Charts

### Components

You can import Chart components from the top-level Elastic Chart module.

```js
import { Axis, BarSeries, Chart, Position, ScaleType } from '@elastic/charts';
```

## Using Elastic Charts in Kibana

To use Elastic Charts code in Kibana, check if `@elastic/charts` packages is already configured as dependency in `package.json` and simply import the components you want.

## Using Elastic Charts in a standalone project

You can consume Elastic Charts in standalone projects, such as plugins and prototypes. Elastic-Charts has a peer dependency on [moment-timezone](https://momentjs.com/timezone/). Add that dependency on your main project with:

```
yarn add moment-timezone
```

### Importing CSS

You __*MUST*__ import CSS styles related to the theme you are using. You may use Webpack or another bundler to import the compiled CSS style with the `style`, `css` and `postcss` loaders.

```js
import '@elastic/charts/dist/theme_light.css';
// or
import '@elastic/charts/dist/theme_dark.css';
```

If using Elastic Charts in a project that already uses [`eui`](https://github.com/elastic/eui) or some other styling library, you should import the **theme only** files, which excludes reset styles.

```js
import '@elastic/charts/dist/theme_only_light.css';
// or
import '@elastic/charts/dist/theme_only_dark.css';
```

> Note: `@elastic/charts` does not provide custom reset styles. We use and test using reset styles provided by [`eui`](https://github.com/elastic/eui) via the [`EuiProvider`](https://eui.elastic.co/#/utilities/provider).

If using Elastic Charts in the same project that is already compiling EUI's Sass (like Kibana), you can import the SASS files directly instead of using the CSS. Just be sure to import Elastic Charts Sass files **after** EUI.

```scss
@import './node_modules/@elastic/eui/src/themes/amsterdam/colors_light';
@import './node_modules/@elastic/eui/src/themes/amsterdam/globals';

@import './node_modules/@elastic/charts/theme_light';
// or
@import './node_modules/@elastic/charts/theme_dark';
```

## Polyfills

Elastic Charts is transpiled to es5 but requires the `core-js/stable` polyfill for IE11.

If using babel there are two [options](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babel)

### Option 1 `preferred` - [`@babel/preset-env`](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpreset-env)

Use a `.babelrc` config with the [`usebuiltins`](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) option set to [`'entry'`](https://babeljs.io/docs/en/babel-preset-env#usebuiltins-entry) and the [`corejs`](https://babeljs.io/docs/en/babel-preset-env#corejs) option set to `3`.

### Option 2 - [`@babel/polyfill`](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill)

Directly import polyfill and runtime.

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```
