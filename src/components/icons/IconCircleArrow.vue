<template>
  <svg :height="height" :fill="color"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" :style="style"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 281c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 136c0-13.3 10.7-24 24-24s24 10.7 24 24l0 182.1 71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 393c-9.4 9.4-24.6 9.4-33.9 0L127 281z"/></svg>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  height: {type: Number, default:12},
  color: {type: String, default:'#333333'},
  rotate: {type: Number, default: 0}
})
const style = computed(() => 'transform: rotate('+props.rotate+'deg)')
</script>