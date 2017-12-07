# VueTransitionGroupX

[![npm](https://img.shields.io/npm/v/vue-transition-group-x.svg)](https://www.npmjs.com/package/vue-transition-group-x) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> Enhanced transition-group for Vue

## Features

- Staggering: built-in support so you don't have to reinvent the wheel every time. Works with css transitions.
- beforeAllLeave event: runs before beforeLeave and leave of **all** the leaving elements.
  This can be used to give leaving elements an explicit absolute position and prevent them from moving.

## Installation

```bash
npm install --save vue-transition-group-x
```

```bash
yarn add vue-transition-group-x
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import VueTransitionGroupX from 'vue-transition-group-x'

Vue.use(VueTransitionGroupX)
```

This will register the `transition-group-x` component.

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<script src="vue-transition-group-x/dist/vue-transition-group-x.js"></script>

<!-- From CDN -->
<script src="https://unpkg.com/vue-transition-group-x"></script>
```

The `transition-group-x` component will be installed automatically,
you do not need to call `Vue.use`.

## Development

### Launch visual tests

```bash
npm run dev
```

### Launch Karma with coverage

```bash
npm run dev:coverage
```

### Build

Bundle the js to the `dist` folder:

```bash
npm run build
```


## Publishing

The `prepublish` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
