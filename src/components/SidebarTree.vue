<template>
    <div class="sidebar-tree">
        <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :default-expanded-keys="expandedKeys"
            :highlight-current="true"
        >
            <template #default="{ node, data }">
        <span class="custom-tree-node">
          <el-icon v-if="data.type === 'directory'"><folder/></el-icon>
          <el-icon v-else><document/></el-icon>
          <span>{{ node.label }}</span>
        </span>
            </template>
        </el-tree>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {Document, Folder} from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useFileStore } from '../stores/fileStore'

const fileStore = useFileStore()

const treeData = ref([])
const expandedKeys = ref([])

const defaultProps = {
    children: 'children',
    label: 'name'
}

const handleNodeClick = (data) => {
    if (data.type !== 'directory') {
        const filePath = getFilePath(data)
        console.log('SidebarTree - handleNodeClick:', { filePath, type: getFileType(filePath) });
        emit('fileSelected', {
            url: `/uploads/${filePath}`,
            type: getFileType(filePath)
        })
    }
}

const getFilePath = (data) => {
    let path = data.name
    let parent = data.parent
    while (parent) {
        path = parent.name + '/' + path
        parent = parent.parent
    }
    return path
}

const getFileType = (filePath) => {
    const extension = filePath.toLowerCase().split('.').pop()
    // 返回标准的 MIME 类型
    switch (extension) {
        case 'md':
        case 'markdown':
            return 'text/markdown'
        case 'pdf':
            return 'application/pdf'
        case 'doc':
        case 'docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        case 'ppt':
        case 'pptx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        default:
            return 'text/plain'
    }
}

const loadTreeData = async () => {
    try {
        const response = await axios.get('/api/files/tree')
        treeData.value = response.data
        // 默认展开第一级
        expandedKeys.value = treeData.value.map(node => node.id)
    } catch (error) {
        console.error('Failed to load file tree:', error)
        ElMessage.error('加载文件列表失败')
    }
}

onMounted(() => {
    loadTreeData()
})

// 监听文件变化
watch(() => fileStore.needRefresh, (newValue) => {
    if (newValue) {
        loadTreeData()
        fileStore.setNeedRefresh(false)
    }
})

const emit = defineEmits(['fileSelected'])
</script>

<style scoped>
.sidebar-tree {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
}

.custom-tree-node {
    display: flex;
    align-items: center;
    gap: 8px;
}

.el-icon {
    font-size: 16px;
}
</style>
