import stylis from './stylis.js'
import hash from 'fnv1a'
const st = stylis()

function rehydrate() {
  const serverSheet: HTMLStyleElement = document.querySelector('#__css__')
  if (!serverSheet) return
  const rules = (serverSheet.sheet as CSSStyleSheet).cssRules

  const localCache = {}

  Array.prototype.forEach.call(rules, (rule, i) => {
    const { cssText, selectorText } = rule
    localCache[selectorText.slice(1)] = cssText.replace(selectorText, '').trim()
  })

  return localCache
}

const isServer = typeof window === 'undefined'
export const cache = isServer ? {} : rehydrate() || {}
export const flush = () =>
  Object.keys(cache)
    .map((cn) => `.${cn}${cache[cn]}`)
    .join('')
let sheet = null

if (!isServer) {
  let element: HTMLStyleElement = document.querySelector('#__css__')

  if (!element) {
    element = document.createElement('style')
    element.id = '__css__'
    document.head.appendChild(element)
  }

  sheet = element.sheet
}

function process(className: string, rules: string) {
  if (!rules) return ''
  const generatedRules = st('', rules)

  if (sheet) {
    sheet.insertRule(`.${className}${generatedRules}`)
  }

  return generatedRules
}

function getClassName(dec: string) {
  const h = hash(dec)
  const className = 'z-' + h.toString(16)

  return className
}

export function css(rules: string) {
  const decls = rules.trim().split(';')

  let combinedClassname = ''

  for (let dec of decls) {
    dec = dec.trim()
    if (!dec) continue

    const cn = getClassName(dec)

    combinedClassname += cn

    if (!cache[cn]) {
      const rules = process(cn, dec)
      cache[cn] = rules
    }

    combinedClassname += ' '
  }

  return combinedClassname.trim()
}
