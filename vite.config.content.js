import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react({ jsxRuntime: 'classic' })], // Use classic runtime to avoid jsxDEV issues in IIFE
    build: {
        emptyOutDir: false,
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'src/content/index.jsx'),
            name: 'ContentScript',
            fileName: () => 'assets/content.js',
            formats: ['iife']
        },
        rollupOptions: {
            output: {
                extend: true,
                // Removed globals to force bundling of React/ReactDOM
            }
        }
    },
    define: {
        'process.env.NODE_ENV': '"production"'
    }
})
