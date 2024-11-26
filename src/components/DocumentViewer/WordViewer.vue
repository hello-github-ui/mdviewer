<template>
    <div class="word-viewer">
        <div class="document-content" v-html="content" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import mammoth from 'mammoth'
import { ElMessage } from 'element-plus'

const props = defineProps({
    fileData: {
        type: Object,
        required: true
    }
})

const content = ref('')

const loadDocument = async () => {
    try {
        const response = await fetch(props.fileData.url)
        const arrayBuffer = await response.arrayBuffer()

        const result = await mammoth.convertToHtml({ arrayBuffer })
        content.value = result.value
    } catch (error) {
        ElMessage.error('Word 文档加载失败')
        console.error('Error loading Word document:', error)
    }
}

watch(() => props.fileData, () => {
    loadDocument()
}, { immediate: true })
</script>

<style scoped>
.word-viewer {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.document-content {
    background: white;
    padding: 40px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.document-content :deep(h1) {
    font-size: 2em;
    margin-bottom: 1em;
}

.document-content :deep(h2) {
    font-size: 1.5em;
    margin: 1em 0;
}

.document-content :deep(p) {
    margin: 1em 0;
    line-height: 1.6;
}

.document-content :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
}

.document-content :deep(td),
.document-content :deep(th) {
    border: 1px solid #ddd;
    padding: 8px;
}

.document-content :deep(img) {
    max-width: 100%;
    height: auto;
}
</style>
