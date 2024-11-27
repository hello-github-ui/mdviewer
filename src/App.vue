<template>
    <div class="app-container">
        <el-container>
            <el-aside width="250px">
                <div class="logo">
                    <h1>MDViewer</h1>
                </div>
                <SidebarTree @file-selected="handleFileSelected"/>
            </el-aside>

            <el-container>
                <el-main>
                    <div class="main-content">
                        <template v-if="!currentFile">
                            <FileUploader @file-uploaded="handleFileUploaded"/>
                        </template>
                        <template v-else>
                            <FileViewer :file-data="currentFile"/>
                        </template>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import FileUploader from './components/FileUploader.vue'
import SidebarTree from './components/SidebarTree.vue'
import FileViewer from './components/FileViewer.vue'

const currentFile = ref(null)

const handleFileSelected = (file) => {
    currentFile.value = file
}

const handleFileUploaded = (file) => {
    currentFile.value = file
}
</script>

<style>
.app-container {
    height: 100vh;
    width: 100vw;
}

.el-container {
    height: 100%;
}

.el-aside {
    background: #fff;
    border-right: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
}

.logo {
    padding: 16px;
    border-bottom: 1px solid #e6e6e6;
}

.logo h1 {
    margin: 0;
    font-size: 24px;
    color: #409EFF;
}

.el-main {
    padding: 0;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
