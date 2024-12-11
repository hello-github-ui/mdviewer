import fs from 'fs';
import path from 'path';
import axios from 'axios';

/**
 * 从 Markdown 内容中提取所有图片引用
 * @param {string} content Markdown 内容
 * @returns {string[]} 图片引用路径数组
 */
export function extractImagePaths(content) {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const images = [];
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
        images.push(match[1]);
    }
    
    return images;
}

/**
 * 下载网络图片到本地
 * @param {string} url 图片的网络地址
 * @param {string} dest 本地存储路径
 */
async function downloadImage(url, dest) {
    const writer = fs.createWriteStream(dest);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

/**
 * 处理 Markdown 文件中的图片
 * @param {string} mdFilePath Markdown 文件路径
 * @param {string} uploadDir 上传目录
 * @returns {string} 处理后的 Markdown 内容
 */
export async function processMarkdownImages(mdFilePath, uploadDir) {
    // 处理 Markdown 文件: C:\Users\admin\code\mdviewer\uploads\20241211160652\万能视频倍速播放-1733904412517.md, 
    // 上传目录: C:\Users\admin\code\mdviewer\uploads\20241211160652
    // console.log(`处理 Markdown 文件: ${mdFilePath}, 上传目录: ${uploadDir}`);
    // 读取 Markdown 文件内容
    const content = await fs.promises.readFile(mdFilePath, 'utf8');
    
    // 提取所有图片路径
    const imagePaths = extractImagePaths(content);
    // console.log('提取到的图片路径:', imagePaths);
    let newContent = content;
    
    for (const imgPath of imagePaths) {
        try {
            // 使用上传目录作为图片的新目录
            const imagesDir = uploadDir;
            await fs.promises.mkdir(imagesDir, { recursive: true });
            
            if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
                // 下载网络图片到新目录
                const newImageName = path.basename(imgPath);
                const newImagePath = path.join(imagesDir, newImageName);
                console.log(`下载网络图片: ${imgPath} 到 ${newImagePath}`);
                await downloadImage(imgPath, newImagePath);
                
                // 更新 Markdown 中的图片引用
                const relativePath = `./${newImageName}`;
                if (newContent.includes(imgPath)) {
                    console.log(`即将更新网络图片引用: ${imgPath}`);
                    newContent = newContent.replace(
                        new RegExp(escapeRegExp(imgPath), 'g'),
                        relativePath
                    );
                    console.log(`更新 Markdown 中的图片引用: ${imgPath} -> ${relativePath}`);
                }
            } else {
                // 处理本地图片，本地图片只需要保留文件名和后缀
                let imgName = imgPath.match(/[^/\\]+$/)[0]
                const fullImagePath = path.resolve(uploadDir, imgName);
                // 更新 Markdown 中的图片引用，由于上传后图片和md文件处于同级目录，直接 ./ 即可
                // console.log('更新 Markdown 中的图片引用，由于上传后图片和md文件处于同级目录，直接 ./ 即可')
                const relativePath = `./` + imgName;
                console.log(`imgPath: ${imgPath}`)
                if (newContent.includes(imgPath)) {
                    console.log(`即将更新本地图片引用: ${imgPath}`);
                    newContent = newContent.replace(
                        new RegExp(escapeRegExp(imgPath), 'g'),
                        relativePath
                    );
                    console.log(`更新 Markdown 中的图片引用: ${imgPath} -> ${relativePath}`);
                }
            }
        } catch (error) {
            console.error(`Error processing image ${imgPath}:`, error);
        }
    }
    
    return newContent;
}

/**
 * 转义正则表达式中的特殊字符
 * @param {string} string 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
