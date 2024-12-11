<template>
    <div class="markdown-viewer">
        <div class="markdown-content" v-html="renderedContent" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const props = defineProps({
    fileData: {
        type: Object,
        required: true
    }
})

const renderedContent = ref('')

// 配置 marked
marked.setOptions({
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-'
})

const renderMarkdown = async () => {
    try {
        // 使用 encodeURIComponent 确保文件路径正确
        const filePath = encodeURIComponent(props.fileData.url);
        console.log('Rendering file:', filePath);
        const response = await fetch(filePath);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const text = await response.text()
        console.log('File content length:', text.length);
        
        if (props.fileData.type === 'pdf') {
            // 使用 pdf.js 渲染 PDF
            const loadingTask = pdfjsLib.getDocument(props.fileData.url);
            loadingTask.promise.then(pdf => {
                // 获取第一页
                pdf.getPage(1).then(page => {
                    const scale = 1.5;
                    const viewport = page.getViewport({ scale });

                    // 准备 canvas 用于渲染
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // 渲染 PDF 页面到 canvas 上
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);

                    // 将 canvas 内容添加到页面
                    document.querySelector('.markdown-content').appendChild(canvas);
                });
            });
        } else {
            // 配置 marked 的图片渲染器
            const renderer = new marked.Renderer();
            const baseUrl = props.fileData.url.substring(0, props.fileData.url.lastIndexOf('/') + 1);
            
            renderer.image = (href, title, text) => {
                // 如果是相对路径，转换为绝对路径
                if (href && !href.startsWith('http') && !href.startsWith('data:')) {
                    href = new URL(href, baseUrl).href;
                }
                return `<img src="${href}" alt="${text}" title="${title || ''}" style="max-width: 100%;">`;
            };

            marked.setOptions({ renderer });
            renderedContent.value = marked(text);
        }
    } catch (error) {
        console.error('Error rendering markdown:', error)
    }
}

// 监听 fileData 变化
watch(() => props.fileData, (newVal, oldVal) => {
    console.log('MarkdownViewer - fileData changed:', { 
        new: newVal,
        old: oldVal 
    });
    if (newVal && newVal.url) {
        renderMarkdown()
    }
}, { immediate: true, deep: true })
</script>

<style scoped>
.markdown-viewer {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.markdown-content {
    line-height: 1.6;
}

.markdown-content :deep(h1) {
    font-size: 2em;
    margin-bottom: 1em;
}

.markdown-content :deep(h2) {
    font-size: 1.5em;
    margin: 1em 0;
}

.markdown-content :deep(p) {
    margin: 1em 0;
}

.markdown-content :deep(pre) {
    background: #f6f8fa;
    padding: 16px;
    border-radius: 6px;
    overflow: auto;
}

.markdown-content :deep(code) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

.markdown-content :deep(img) {
    max-width: 100%;
    height: auto;
}
</style>
