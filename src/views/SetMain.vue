<template>
  <div>
    <set-viewer />
  </div>
</template>

<script>
// @ is an alias to /src
import SetViewer from '@/components/SetViewer.vue'

export default {
  name: 'setMain',
  components: {
    SetViewer
  }
}
</script>

<style>
.nightMode {
  background-color:black
}
</style>
