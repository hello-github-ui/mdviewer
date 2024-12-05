<template>
    <div class="file-uploader">
        <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload"
            :with-credentials="true"
            :headers="{
                'Accept': 'application/json'
            }"
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
    // 处理文件名以确保中文字符正常显示
    const fileName = decodeURIComponent(file.name);
    console.log(`fileName: ${fileName}`);
    // 获取文件扩展名
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))
    if (!allowedTypes.includes(extension)) {
        ElMessage.error('不支持的文件格式！')
        return false
    }
    return true
}

const handleSuccess = (response) => {
    if (response.success) {
        ElMessage.success('文件上传成功！')
        // 打印输出 response.data
        console.log(`response.data: ${JSON.stringify(response.data, null, 2)}`);
        
        // 触发父组件的更新
        emit('fileUploaded', response.data)
    } else {
        ElMessage.error(response.error || '文件上传失败！')
    }
}

const handleError = (error) => {
    console.error('Upload error:', error)
    ElMessage.error('文件上传失败，请重试！' + error.message);
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
