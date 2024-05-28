import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.tsx'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
})
