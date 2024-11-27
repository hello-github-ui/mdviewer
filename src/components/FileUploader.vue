<template>
    <div class="file-uploader">
        <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload"
            multiple
        >
            <el-icon class="el-icon--upload">
                <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
                拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    支持 Markdown、PDF、Word、PPT 等格式
                </div>
            </template>
        </el-upload>
    </div>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import {UploadFilled} from '@element-plus/icons-vue'

const uploadUrl = '/api/upload'

const allowedTypes = [
    '.md',
    '.markdown',
    '.pdf',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx'
]

const beforeUpload = (file) => {
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!allowedTypes.includes(extension)) {
        ElMessage.error('不支持的文件格式！')
        return false
    }
    return true
}

const handleSuccess = (response) => {
    ElMessage.success('文件上传成功！')
    // 触发父组件的更新
    emit('fileUploaded', response.data)
}

const handleError = () => {
    ElMessage.error('文件上传失败，请重试！')
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
</style>
