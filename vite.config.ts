import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkg = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'), 'utf8'),
)

export default defineConfig({
  plugins: [react()],
  base: './',
  envPrefix: ['NODEGET_'],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
