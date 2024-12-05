import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { convertFile } from './services/converter.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// 配置 CORS
const corsOptions = {
    origin: 'http://localhost:9523',  // 允许前端开发服务器的域名
    methods: ['GET', 'POST', 'OPTIONS'],  // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'],  // 允许的请求头
    credentials: true,  // 允许发送凭证
    optionsSuccessStatus: 200  // 对于旧版浏览器的支持
}

app.use(cors(corsOptions))

// 添加预检请求的处理
app.options('*', cors(corsOptions))

const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {recursive: true})
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + ext)
    }
})

const upload = multer({storage: storage})

// 静态文件服务
app.use('/uploads', express.static(uploadsDir))
app.use(express.static(path.join(__dirname, '../dist')))

// 文件上传处理
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('Received upload request')
        if (!req.file) {
            console.log('No file received')
            return res.status(400).json({error: '没有上传文件'})
        }
        // 处理文件名（针对中文进行处理）
        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        console.log('Original name:', originalName);
        // 同时将 file 中的 originalname 转换为处理后的文件名
        req.file.originalname = originalName
        const file = req.file
        console.log('File received:', file)
        // 获取文件扩展名
        const ext = path.extname(originalName).toLowerCase()

        // 转换文件
        console.log('Converting file:', file.path, ext)
        const convertedFile = await convertFile(file.path, ext)
        console.log('File converted:', convertedFile)

        const response = {
            success: true,
            data: {
                id: file.filename,
                name: originalName,
                type: file.mimetype,
                url: `/uploads/${convertedFile}`,
                originalUrl: `/uploads/${file.filename}`
            }
        }
        console.log('Sending response:', response)
        res.json(response)
    } catch (error) {
        console.error('File upload error:', error)
        res.status(500).json({error: '文件上传失败: ' + error.message})
    }
})

// 获取文件树
app.get('/api/files/tree', (req, res) => {
    try {
        const tree = buildFileTree(uploadsDir)
        res.json(tree)
    } catch (error) {
        console.error('Error getting file tree:', error)
        res.status(500).json({error: '获取文件列表失败'})
    }
})

function buildFileTree(dir) {
    const files = fs.readdirSync(dir)
    const tree = []

    files.forEach(file => {
        const fullPath = path.join(dir, file)
        const stats = fs.statSync(fullPath)
        const isDirectory = stats.isDirectory()

        const node = {
            id: path.relative(uploadsDir, fullPath),
            name: file,
            type: isDirectory ? 'directory' : 'file'
        }

        if (isDirectory) {
            node.children = buildFileTree(fullPath)
        } else {
            node.url = `/uploads/${node.id}`
        }

        tree.push(node)
    })

    return tree
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
