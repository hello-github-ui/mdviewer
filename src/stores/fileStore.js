import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useFileStore = defineStore('file', () => {
    const needRefresh = ref(false)
    const state = ref({
        files: [] // 存储文件信息的数组
    })

    function setNeedRefresh(value) {
        needRefresh.value = value
    }

    function addFile(file) {
        state.value.files.push(file) // 将新文件添加到文件数组中
    }

    function getFiles() {
        return state.value.files // 获取文件列表
    }

    return {
        needRefresh,
        setNeedRefresh,
        state,
        addFile,
        getFiles
    }
})
