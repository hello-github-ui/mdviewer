import {defineConfig} from "vite";
import dotenv, {parse} from 'dotenv';
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
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.woff2')) {
                        return 'fonts/[name][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                },
            }
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        host: '0.0.0.0',
        port: frontEndPort,
    }
});
