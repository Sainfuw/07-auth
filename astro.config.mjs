import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

import netlify from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  adapter: netlify(),
  experimental: {
    actions: true,
  },
})
