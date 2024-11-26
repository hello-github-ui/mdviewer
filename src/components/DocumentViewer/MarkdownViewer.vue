<template>
    <div class="markdown-viewer">
        <div class="markdown-content" v-html="renderedContent" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

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
        const response = await fetch(props.fileData.url)
        const text = await response.text()
        renderedContent.value = marked(text)
    } catch (error) {
        console.error('Error rendering markdown:', error)
    }
}

watch(() => props.fileData, () => {
    renderMarkdown()
}, { immediate: true })
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
