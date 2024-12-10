<template>
    <div class="file-uploader">
        <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :with-credentials="true"
            :headers="{
                'Accept': 'application/json'
            }"
            multiple
            :limit="10"
            :file-list="fileList"
        >
            <el-icon class="el-icon--upload">
                <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
                拖拽文件到此处或 <em>点击选择文件</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    请上传 Markdown 文件，引用的图片将自动处理。
                </div>
            </template>
        </el-upload>

        <div v-if="currentMarkdown" class="markdown-info">
            <p>当前处理的 Markdown 文件: {{ currentMarkdown.name }}</p>
            <p>已选择的图片文件:</p>
            <ul>
                <li v-for="img in selectedImages" :key="img.name">{{ img.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import {UploadFilled} from '@element-plus/icons-vue'
import { useFileStore } from '../stores/fileStore'
import { ref, computed } from 'vue'

const fileStore = useFileStore()
const uploadUrl = '/api/upload'
const fileList = ref([])
const currentMarkdown = ref(null)

// 允许的文件类型
const allowedTypes = {
    markdown: ['.md', '.markdown'],
    images: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
}

// 获取所有允许的文件类型
const allAllowedTypes = [...allowedTypes.markdown, ...allowedTypes.images]

// 计算已选择的图片文件
const selectedImages = computed(() => {
    return fileList.value.filter(file => {
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
        return allowedTypes.images.includes(ext)
    })
})

const isMarkdownFile = (filename) => {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))
    return allowedTypes.markdown.includes(ext)
}

const isImageFile = (filename) => {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))
    return allowedTypes.images.includes(ext)
}

const handleChange = (file, fileList) => {
    fileList.value = fileList
    console.log('用户选中的文件名称:', file.name);
    
    // 如果是 Markdown 文件，更新当前处理的 Markdown 文件
    if (isMarkdownFile(file.name)) {
        currentMarkdown.value = file
    }
    // 如果是图片文件，添加到已选择的图片列表
    if (isImageFile(file.name)) {
        selectedImages.value.push(file)
    }
}

const beforeUpload = (file) => {
    if (isMarkdownFile(file.name)) {
        currentMarkdown.value = file;
        // 将文件的相对路径作为字段附加到上传请求中
        file.relativePath = file.webkitRelativePath || file.name; // 使用 webkitRelativePath 或文件名
        return true;
    }
    return false;
}

const handleSuccess = (response) => {
    if (response.success) {
        ElMessage({
            message: '文件上传成功',
            type: 'success'
        })
        // 只触发文件树刷新，移除文件内容加载
        fileStore.setNeedRefresh(true)
    } else {
        ElMessage.error(response.error || '文件上传失败！')
    }
}

const handleError = (error) => {
    console.error('Upload error:', error)
    ElMessage.error('文件上传失败，请重试！' + error.message)
}

const emit = defineEmits(['fileUploaded'])
</script>

<style scoped>
.file-uploader {
    width: 100%;
    max-width: 360px;
}

:deep(.el-upload) {
    width: 100%;
}

:deep(.el-upload-dragger) {
    width: 100%;
}

.el-upload__tip {
    color: #666;
    font-size: 14px;
    margin-top: 8px;
    text-align: center;
}

.markdown-info {
    margin-top: 16px;
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
}

.markdown-info p {
    margin: 8px 0;
    color: #606266;
}

.markdown-info ul {
    margin: 8px 0;
    padding-left: 20px;
    color: #606266;
}

.markdown-info li {
    margin: 4px 0;
}
</style>
