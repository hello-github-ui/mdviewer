import express from 'express'
import multer from 'multer'
import path from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import {convertFile} from './services/converter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

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
        if (!req.file) {
            return res.status(400).json({error: '没有上传文件'})
        }

        const file = req.file
        const originalName = file.originalname
        const ext = path.extname(originalName).toLowerCase()

        // 转换文件
        const convertedFile = await convertFile(file.path, ext)

        res.json({
            success: true,
            data: {
                id: file.filename,
                name: originalName,
                type: file.mimetype,
                url: `/uploads/${convertedFile}`,
                originalUrl: `/uploads/${file.filename}`
            }
        })
    } catch (error) {
        console.error('File upload error:', error)
        res.status(500).json({error: '文件上传失败'})
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
