import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore('file', () => {
  const needRefresh = ref(false)

  function setNeedRefresh(value) {
    needRefresh.value = value
  }

  return {
    needRefresh,
    setNeedRefresh
  }
})
