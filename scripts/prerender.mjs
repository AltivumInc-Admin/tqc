/*
 * Prerender the landing route into dist/index.html so the hero paints
 * from HTML before React boots. Runs after the client and SSR builds:
 *   vite build && vite build --ssr src/entry-static.jsx --outDir dist-ssr
 * Only "/" is prerendered — the Amplify catch-all serves this file for
 * every extensionless path, so main.jsx hydrates on "/" and clears +
 * client-renders everywhere else.
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { createElement } from 'react'
import { prerender } from 'react-dom/static'

const { default: Static } = await import(
  new URL('../dist-ssr/entry-static.js', import.meta.url).href
)

const { prelude } = await prerender(createElement(Static, { url: '/' }))
const markup = await new Response(prelude).text()

if (!markup.includes('hero-wordmark')) {
  throw new Error('prerender: hero wordmark missing from the rendered markup')
}

const indexPath = new URL('../dist/index.html', import.meta.url)
const html = await readFile(indexPath, 'utf8')
const shell = '<div id="root"></div>'
if (!html.includes(shell)) {
  throw new Error('prerender: #root shell not found in dist/index.html')
}

await writeFile(
  indexPath,
  html.replace(shell, `<div id="root" data-prerendered="true">${markup}</div>`),
)
await rm(new URL('../dist-ssr/', import.meta.url), { recursive: true, force: true })

console.log(`prerender: / → ${(markup.length / 1024).toFixed(1)} kB of HTML into dist/index.html`)
