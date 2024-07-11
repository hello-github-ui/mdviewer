import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const frontendApp = express();

const frontendPort = parseInt(process.env.FRONTEND_PORT || 9523, 10);

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// 设置静态文件目录
frontendApp.use(express.static(path.join(__dirname, './docs')));

// 启动静态文件服务
frontendApp.listen(frontendPort, () => {
    console.log(`Static file server running on port http://localhost:${frontEndPort}`);
});
