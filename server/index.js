import cors from "cors";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { convertFile } from "./services/converter.js";
import { processMarkdownImages } from "./services/imageProcessor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 配置 CORS
const corsOptions = {
    origin: "http://localhost:9523", // 允许前端开发服务器的域名
    methods: ["GET", "POST", "OPTIONS"], // 允许的 HTTP 方法
    allowedHeaders: ["Content-Type", "Authorization"], // 允许的请求头
    credentials: true, // 允许发送凭证
    optionsSuccessStatus: 200, // 对于旧版浏览器的支持
};

app.use(cors(corsOptions));

// 添加预检请求的处理
app.options("*", cors(corsOptions));

/**
 * 获取当前时间 格式：yyyy-MM-dd HH:MM:SS
 */
function getCurrentTime() {
    let date = new Date(); // 当前时间
    let month = zeroFill(date.getMonth() + 1); // 月
    let day = zeroFill(date.getDate()); // 日
    let hour = zeroFill(date.getHours()); // 时
    let minute = zeroFill(date.getMinutes()); // 分
    let second = zeroFill(date.getSeconds()); // 秒
    
    // 当前时间
    // var curTime = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    let curTime = "" +date.getFullYear() +  month + day + hour + minute + second;
    
    return curTime;
}
 
/**
 * 补零
 */
function zeroFill(i){
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}

/**
 * 自定义文件上传配置
 * 可以在此处配置上传文件的存储路径、文件名等
 */
const baseUploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(baseUploadsDir)) {
    fs.mkdirSync(baseUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 如果是图片文件，存储到临时目录
        if (file.mimetype.startsWith('image/')) {
            const tempDir = path.join(baseUploadsDir, 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            cb(null, tempDir);
        } else {
            cb(null, baseUploadsDir);
        }
    },
    filename: function (req, file, cb) {
        // 处理中文文件名
        const originalName = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
        );
        const ext = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, ext);
        const uniqueSuffix = Date.now();
        cb(null, nameWithoutExt + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

// 静态文件服务
app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, '../uploads')));

app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.md')) {
            res.set("Content-Type", "text/markdown");
        }
    }
}));

app.get('/uploads/*', (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params[0]);
    console.log('Received request for:', req.path);
    console.log('Serving file:', filePath);

    const fileExt = path.extname(filePath);
    let contentType = 'text/markdown';
    if (fileExt === '.md') {
        contentType = 'text/markdown';
    } else if (fileExt === '.txt') {
        contentType = 'text/plain';
    }

    res.sendFile(filePath, { headers: { 'Content-Type': contentType } }, (err) => {
        if (err) {
            console.error('File not found:', err);
            res.status(404).send('File not found');
        } else {
            console.log('File sent successfully:', req.params[0]);
        }
    });
});

// 文件上传处理
app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        console.log("Received upload request");
        const directoryPath = req.body.directoryPath; // 获取用户输入的目录路径
        console.log("用户输入的目录路径:", directoryPath);

        // 动态创建上传目录
        const currentUploadDir = path.join(baseUploadsDir, getCurrentTime());
        if (!fs.existsSync(currentUploadDir)) {
            fs.mkdirSync(currentUploadDir, { recursive: true });
        }

        // 构建 assets 目录路径
        const assetsDir = path.join(directoryPath, 'assets');
        console.log("图片目录路径:", assetsDir);

        // 将上传的 Markdown 文件移动到当前上传目录
        const newMdFilePath = path.join(currentUploadDir, req.file.filename);
        await fs.promises.rename(req.file.path, newMdFilePath);
        console.log(`Markdown 文件移动到: ${newMdFilePath}`);

        // 处理 Markdown 文件中的图片
        const newContent = await processMarkdownImages(newMdFilePath, currentUploadDir);

        // 更新 Markdown 文件内容
        await fs.promises.writeFile(newMdFilePath, newContent, 'utf8');
        console.log(`Markdown 文件内容更新成功: ${newMdFilePath}`);

        // 复制 assets 目录中的图片到项目上传目录
        if (fs.existsSync(assetsDir)) {
            const images = await fs.promises.readdir(assetsDir);
            for (const image of images) {
                const srcImagePath = path.join(assetsDir, image);
                const destImagePath = path.join(currentUploadDir, image);
                await fs.promises.copyFile(srcImagePath, destImagePath);
                console.log(`复制图片: ${srcImagePath} 到 ${destImagePath}`);
            }
        }

        res.json({
            message: "文件上传成功",
            filePath: `/uploads/${getCurrentTime()}/${req.file.filename}`
        });
        console.log('Upload response sent successfully');
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ error: "文件上传失败: " + error.message });
        console.log('Error response sent:', error.message);
    }
});

// 获取文件树
app.get("/api/files/tree", (req, res) => {
    try {
        const tree = buildFileTree(baseUploadsDir);
        res.json(tree);
        console.log('File tree response sent successfully');
    } catch (error) {
        console.error("Error getting file tree:", error);
        res.status(500).json({ error: "获取文件列表失败" });
        console.log('Error response sent:', error.message);
    }
});

function buildFileTree(dir) {
    const files = fs.readdirSync(dir);
    const tree = [];

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const isDirectory = stats.isDirectory();

        const node = {
            id: path.relative(baseUploadsDir, fullPath),
            name: file,
            type: isDirectory ? "directory" : "file",
        };

        if (isDirectory) {
            node.children = buildFileTree(fullPath);
        } else {
            node.url = `/uploads/${node.id}`;
        }

        tree.push(node);
    });

    return tree;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
