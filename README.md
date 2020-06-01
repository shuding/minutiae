# minutiae ![npm bundle size](https://img.shields.io/bundlephobia/minzip/minutiae)

> the small, precise details.

Minutiae is a small replacement for writing inline styles. Runtime by default to complement a static CSS solution like [Treat]() or [CSS Modules]().

<br />

## Installation

```
$ yarn add minutiae
```

<br />

## Usage

Import `css` from the package:

```ts
const { css } = minutiae
```

Pass a string of CSS and it will return a class:

```jsx
<div className={css('color: red')}>Hello</div>
```

<br />

## Server side rendering

Import `flush` and call it inside of a `<style>` tag with the `id="__css__"` (this enables client side hydration):

```ts
const { flush } = minutiae

const html = `
<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title>my app</title>
    <style id="__css__">${flush()}</style>
  </head>
  <body>
    <main>${renderedHTML}</main>
  </body>
</html>
`
```

### Next.js

You should flush inside of your custom `_document.js` file:

```js
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

import { flush } from 'minutiae'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style id="__css__" dangerouslySetInnerHTML={{ __html: flush() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

<br />

## Example

Scenario: the majority of your component styles are static, so you use CSS Modules for static extraction and good caching.

```js
// Your static styles
import styles from './button.module.css'

const Button = ({ children }) => {
  return <button className={styles.button}>{children}</button>
}
```

Then you introduce a prop that needs absolute dynamic styling:

```js
// Your static styles
import styles from './button.module.css'

const Button = ({ children, padding }) => {
  return (
    <button
      className={styles.button}
      // Padding is completely dynamic, so you use inline styles
      style={{ padding }}
    >
      {children}
    </button>
  )
}
```

But this is slow, ugly, and disables useful features like automatic prefixing. Instead, use minutiae:

```js
// Your static styles
import styles from './button.module.css'

import { css } from 'minutiae'
import cn from 'classnames'

const Button = ({ children }) => {
const Button = ({ children, padding }) => {
  return (
    <button className={cn(
      styles.button,
      css(`padding: ${padding};`)
    )}>
      {children}
    </button>
  )
}
```

Now your styles are defined using an actual stylesheet.

<br />

## Usage with CSS Variables

CSS Variables are a great way to use dynamic values in your static CSS. Minutiae was created specifically to inject CSS Variable values without using inline styles:

```css
/* Static CSS, but it can use dynamic values */
.button {
  color: var(--button-color, white);
}
```

```js
<button className={css(`--button-color: ${buttonColor};`)}>
```

<br />

## When _not_ to use minutiae

Static is best. If you can, specify your styling states statically and toggle them using [classnames]().

```js
// Your static styles
import styles from './button.module.css'

import cn from 'classnames'

const Button = ({ children, bold }) => {
  return (
    <button
      className={cn(styles.button, {
        // Conditionally toggle a static class
        [styles.bold]: bold,
      })}
    >
      {children}
    </button>
  )
}
```

This is better performance than using inline styles or minutiae.

<br />

## Features

- Caching: the same CSS written in two places uses the same class.
- Atomic: each declaration is split into it's own class
- Scoped styles: generated class names are prefixed with `.z-`
- Prefixing: vendor specific declarations like `-moz-placeholder`
- Minified: appended styles are compressed

## Credits

- Basically a copy of [csz](https://github.com/lukejacksonn/csz)
- Learned a lot from [style-sheet](https://github.com/giuseppeg/style-sheet)
