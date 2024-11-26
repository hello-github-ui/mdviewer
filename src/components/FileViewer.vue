<template>
  <div class="file-viewer">
    <div v-if="!fileData" class="empty-state">
      请选择或上传文件以查看内容
    </div>
    
    <div v-else class="viewer-content">
      <component
        :is="currentViewer"
        :file-data="fileData"
        :key="fileData.id"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MarkdownViewer from './DocumentViewer/MarkdownViewer.vue'
import PdfViewer from './DocumentViewer/PdfViewer.vue'
import WordViewer from './DocumentViewer/WordViewer.vue'
import PptViewer from './DocumentViewer/PptViewer.vue'

const props = defineProps({
  fileData: {
    type: Object,
    default: null
  }
})

const currentViewer = computed(() => {
  if (!props.fileData) return null
  
  switch (props.fileData.type) {
    case 'text/markdown':
      return MarkdownViewer
    case 'application/pdf':
      return PdfViewer
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      return WordViewer
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.ms-powerpoint':
      return PptViewer
    default:
      return null
  }
})
</script>

<style scoped>
.file-viewer {
  height: 100%;
  padding: 20px;
  background: #fff;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 16px;
}

.viewer-content {
  height: 100%;
  overflow: auto;
}
</style>
