import {defineConfig} from "vite";
import dotenv from 'dotenv';
import vue from "@vitejs/plugin-vue";
import path from "path"

// https://vitejs.dev/config/
// vite 的配置文件
// 自定义构建过程

dotenv.config();

const frontEndPort = parseInt(process.env.FRONTEND_PORT || 9523, 10);

export default defineConfig({
    base: './',
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    build: {
        outDir: './docs',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
                assetFileNames(assetInfo) {
                    let extType = assetInfo.name.split('.')[1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    if (assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.woff2')) {
                        return 'fonts/[name][extname]';
                    }
                    return `assets/${extType}/[name]-[hash][extname]`;
                }
            }
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        host: '0.0.0.0',
        port: frontEndPort,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            },
            '/uploads': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});
