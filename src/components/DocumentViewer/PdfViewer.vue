<template>
    <div class="pdf-viewer">
        <div class="toolbar">
            <el-button-group>
                <el-button :disabled="currentPage === 1" @click="prevPage">
                    <el-icon>
                        <arrow-left/>
                    </el-icon>
                </el-button>
                <el-button :disabled="currentPage === totalPages" @click="nextPage">
                    <el-icon>
                        <arrow-right/>
                    </el-icon>
                </el-button>
            </el-button-group>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <el-button-group>
                <el-button :disabled="scale <= 0.5" @click="zoomOut">
                    <el-icon>
                        <zoom-out/>
                    </el-icon>
                </el-button>
                <el-button :disabled="scale >= 2" @click="zoomIn">
                    <el-icon>
                        <zoom-in/>
                    </el-icon>
                </el-button>
            </el-button-group>
        </div>

        <div ref="container" class="pdf-container">
            <canvas ref="pdfCanvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {ArrowLeft, ArrowRight, ZoomIn, ZoomOut} from '@element-plus/icons-vue'
import * as pdfjsLib from 'pdfjs-dist'
import {ElMessage} from 'element-plus'

// 配置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const props = defineProps({
    fileData: {
        type: Object,
        required: true
    }
})

const container = ref(null)
const pdfCanvas = ref(null)
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1)
let pdfDoc = null

const loadPDF = async () => {
    try {
        const loadingTask = pdfjsLib.getDocument(props.fileData.url)
        pdfDoc = await loadingTask.promise
        totalPages.value = pdfDoc.numPages
        renderPage(currentPage.value)
    } catch (error) {
        ElMessage.error('PDF 加载失败')
        console.error('Error loading PDF:', error)
    }
}

const renderPage = async (num) => {
    try {
        const page = await pdfDoc.getPage(num)
        const viewport = page.getViewport({scale: scale.value})

        const canvas = pdfCanvas.value
        const context = canvas.getContext('2d')

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        }

        await page.render(renderContext).promise
    } catch (error) {
        console.error('Error rendering page:', error)
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        renderPage(currentPage.value)
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        renderPage(currentPage.value)
    }
}

const zoomIn = () => {
    if (scale.value < 2) {
        scale.value += 0.1
        renderPage(currentPage.value)
    }
}

const zoomOut = () => {
    if (scale.value > 0.5) {
        scale.value -= 0.1
        renderPage(currentPage.value)
    }
}

watch(() => props.fileData, () => {
    loadPDF()
}, {immediate: true})
</script>

<style scoped>
.pdf-viewer {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.toolbar {
    padding: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.page-info {
    margin: 0 10px;
    color: #666;
}

.pdf-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
    display: flex;
    justify-content: center;
}

canvas {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
