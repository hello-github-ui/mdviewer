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
import {onMounted, ref} from 'vue'
import {Document, Folder} from '@element-plus/icons-vue'
import axios from 'axios'

const treeData = ref([])
const expandedKeys = ref([])

const defaultProps = {
    children: 'children',
    label: 'name'
}

const handleNodeClick = (data) => {
    if (data.type !== 'directory') {
        emit('fileSelected', data)
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
    }
}

onMounted(() => {
    loadTreeData()
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
