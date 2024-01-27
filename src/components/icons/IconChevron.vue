<template>
  <svg :height="height" :fill="color" :style="style" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
</template>

<script setup>
const props = defineProps({
  height: {type: Number, default:12},
  color: {type: String, default:'#333333'},
  rotate: {type: Number, default: 0}
})

const style = 'transform: rotate('+props.rotate+'deg)'

</script>