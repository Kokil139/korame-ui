import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // Replace 'korame-ui' with your GitHub repository name if different
    base: process.env.NODE_ENV === 'production' ? '/',
})
