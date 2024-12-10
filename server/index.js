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

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * 自定义文件上传配置
 * 可以在此处配置上传文件的存储路径、文件名等
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 如果是图片文件，存储到临时目录
        if (file.mimetype.startsWith('image/')) {
            const tempDir = path.join(uploadsDir, 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            cb(null, tempDir);
        } else {
            cb(null, uploadsDir);
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
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, "../dist")));

// 文件上传处理
/**
 * 文件上传处理，要点：
 * 1、upload.single('file'): 用于处理单个文件的上传，是 Express 的一个中间件，它会先执行。
 * 这个中间件负责处理文件上传的请求，并将上传的文件保存到指定的目录。
 * 2、只有当 upload.single('file') 完全处理完（包括文件保存到磁盘）后，才会执行后面的 async 回调函数。
 *
 * // 1. 首先执行
 * upload.single('file')
 *   ↓
 *   // 处理文件上传
 *   // 保存文件到磁盘
 *   // 设置 req.file 对象
 *
 *   ↓
 * // 2. 然后才执行
 * async (req, res) => {
 *   // 这时 req.file 已经可用
 *   // 你的其他处理逻辑
 * }
 * 
 * 这是一个串行的过程，不是并行的。中间件 upload.single('file') 会调用 next() 来出发点下一个处理函数的执行，
 * 如果 upload.single('file') 过程中发生错误，它会直接发送错误响应，后面的 async 回调函数就不会被执行了。
 * @param req 上一步 upload.single('file') 返回的 req 对象
 * @param res 上一步 upload.single('file') 返回的 res 对象
 */
app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        console.log("Received upload request");
        if (!req.file) {
            console.log("No file received");
            return res.status(400).json({ error: "没有上传文件" });
        }
        const relativePath = req.body.relativePath; // 获取相对路径
        console.log("相对路径:", relativePath);

        // 使用相对路径来拼接 assets 目录
        const mdDirname = path.join(uploadsDir, relativePath);
        const assetsDir = path.join(mdDirname, 'assets');
        
        // 处理 Markdown 文件中的图片
        const newContent = await processMarkdownImages(req.file.path, assetsDir);
        
        // 打印上传的文件路径
        console.log("上传的文件路径:", req.file.path);
        // 处理文件名（针对中文进行处理）
        const originalName = Buffer.from(
            req.file.originalname,
            "latin1"
        ).toString("utf8");
        
        req.file.originalname = originalName;
        const file = req.file;
        console.log("File received:", file);
        
        const ext = path.extname(originalName).toLowerCase();
        let convertedFile = file.filename;

        // 如果是 Markdown 文件，处理其中的图片
        if (ext === '.md' || ext === '.markdown') {
            try {
                // 转换文件
                convertedFile = await convertFile(file.path, ext);
            } catch (error) {
                console.error('Error processing markdown images:', error);
            }
        } else {
            // 其他类型文件的转换处理
            convertedFile = await convertFile(file.path, ext);
        }
        
        console.log("File converted:", convertedFile);

        const response = {
            success: true,
            data: {
                id: file.filename,
                name: originalName,
                type: file.mimetype,
                url: `/uploads/${convertedFile}`,
                originalUrl: `/uploads/${file.filename}`,
            },
        };

        console.log("Sending response:", response);
        res.json(response);
        
        // 清理临时目录
        const tempDir = path.join(uploadsDir, 'temp');
        if (fs.existsSync(tempDir)) {
            fs.rm(tempDir, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error('Error cleaning temp directory:', err);
                }
            });
        }
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ error: "文件上传失败: " + error.message });
    }
});

// 获取文件树
app.get("/api/files/tree", (req, res) => {
    try {
        const tree = buildFileTree(uploadsDir);
        res.json(tree);
    } catch (error) {
        console.error("Error getting file tree:", error);
        res.status(500).json({ error: "获取文件列表失败" });
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
            id: path.relative(uploadsDir, fullPath),
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
