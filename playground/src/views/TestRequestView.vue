<template>
  <AButton @click="handleRequest" :loading="loading">测试请求</AButton>
  {{ data }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { localInfo } from '../controller'
defineOptions({
  name: 'TestRequestView'
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = ref({} as any)
const loading = ref(false)
const handleRequest = function () {
  data.value = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localInfo(loading).then((resp: any) => {
    data.value = resp
  })
}
</script>

<style lang="scss" scoped></style>
