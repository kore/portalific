import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // rss-parser (via xml2js) extends Node's EventEmitter. Vite otherwise
      // externalizes the `events` builtin to an empty stub in the browser
      // build, so `Parser.reset()` crashes with
      // "this.removeAllListeners is not a function". Point it at a real
      // browser implementation instead.
      events: 'events'
    }
  },
  build: {
    outDir: 'dist'
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: './test/setup.js',
    include: ['test/**/*.test.js']
  }
})
