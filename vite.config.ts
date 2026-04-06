import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/rent-vs-bricks/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
