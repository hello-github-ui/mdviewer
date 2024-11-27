import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import {exec} from 'child_process'
import mammoth from 'mammoth'

const execAsync = promisify(exec)

export async function convertFile(filePath, ext) {
    // 返回原始文件名，让前端直接处理这些格式
    if (ext.toLowerCase() === '.md' || ext.toLowerCase() === '.pdf') {
        return path.basename(filePath, ext)
    }

    const outputPath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath, ext)}.html`
    )

    switch (ext.toLowerCase()) {
        case '.docx':
        case '.doc':
            await convertWord(filePath, outputPath)
            return path.basename(outputPath)

        case '.pptx':
        case '.ppt':
            await convertPowerPoint(filePath, outputPath)
            return path.basename(outputPath)

        default:
            throw new Error('不支持的文件格式')
    }
}

async function convertWord(inputPath, outputPath) {
    try {
        const result = await mammoth.convertToHtml({path: inputPath})
        const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          ${result.value}
        </body>
      </html>`
        await fs.promises.writeFile(outputPath, html)
    } catch (error) {
        console.error('Error converting Word document:', error)
        throw error
    }
}

async function convertPowerPoint(inputPath, outputPath) {
    try {
        // 使用 pandoc 转换 PPT 到 HTML
        await execAsync(`pandoc "${inputPath}" -o "${outputPath}" --self-contained`)
    } catch (error) {
        console.error('Error converting PowerPoint:', error)
        throw error
    }
}
