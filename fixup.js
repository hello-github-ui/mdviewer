const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/<br>/g, '<br />');
    content = content.replace(/<hr>/g, '<hr />');
    content = content.replace(/<img ([^>]+)>/g, '<img $1 />');
    content = content.replace(/<input ([^>]+)>/g, '<input $1 />');
    fs.writeFileSync(filePath, content, 'utf-8');
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.md')) {
            fixFile(fullPath);
        }
    });
}

walk('./docs/个人博客');