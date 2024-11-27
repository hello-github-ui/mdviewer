<template>
    <div class="ppt-viewer">
        <div class="toolbar">
            <el-button-group>
                <el-button @click="prevSlide" :disabled="currentSlide === 1">
                    <el-icon>
                        <arrow-left/>
                    </el-icon>
                </el-button>
                <el-button @click="nextSlide" :disabled="currentSlide === totalSlides">
                    <el-icon>
                        <arrow-right/>
                    </el-icon>
                </el-button>
            </el-button-group>
            <span class="slide-info">{{ currentSlide }} / {{ totalSlides }}</span>
        </div>

        <div class="slide-container" ref="container">
            <div class="slide-content" ref="slideContent"/>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import JSZip from 'jszip'

const props = defineProps({
    fileData: {
        type: Object,
        required: true
    }
})

const container = ref(null)
const slideContent = ref(null)
const currentSlide = ref(1)
const totalSlides = ref(0)
let slides = []

const loadPresentation = async () => {
    try {
        const response = await fetch(props.fileData.url)
        const arrayBuffer = await response.arrayBuffer()

        // 使用 JSZip 解压 PPTX 文件
        const zip = await JSZip.loadAsync(arrayBuffer)

        // 读取幻灯片内容
        const slideFiles = Object.keys(zip.files).filter(name =>
            name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
        )

        totalSlides.value = slideFiles.length
        slides = await Promise.all(slideFiles.map(async (filename) => {
            const content = await zip.file(filename).async('string')
            return parseSlideXML(content)
        }))

        showSlide(currentSlide.value)
    } catch (error) {
        ElMessage.error('PPT 加载失败')
        console.error('Error loading PPT:', error)
    }
}

const parseSlideXML = (xml) => {
    // 这里需要实现 XML 解析和转换为 HTML 的逻辑
    // 为了简单起见，这里只返回基本的文本内容
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    const texts = Array.from(doc.getElementsByTagName('a:t')).map(t => t.textContent)
    return `<div class="slide">${texts.join('<br>')}</div>`
}

const showSlide = (num) => {
    if (slides[num - 1]) {
        slideContent.value.innerHTML = slides[num - 1]
    }
}

const prevSlide = () => {
    if (currentSlide.value > 1) {
        currentSlide.value--
        showSlide(currentSlide.value)
    }
}

const nextSlide = () => {
    if (currentSlide.value < totalSlides.value) {
        currentSlide.value++
        showSlide(currentSlide.value)
    }
}

watch(() => props.fileData, () => {
    loadPresentation()
}, {immediate: true})
</script>

<style scoped>
.ppt-viewer {
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

.slide-info {
    margin: 0 10px;
    color: #666;
}

.slide-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
}

.slide-content {
    background: white;
    aspect-ratio: 16/9;
    width: 90%;
    max-height: 90%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 40px;
    overflow: auto;
}

.slide {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 24px;
    line-height: 1.6;
}
</style>
