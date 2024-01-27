<template>
  <svg :height="height" :fill="color" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
</template>

<script setup>
defineProps({
  height: {type: Number, default:12},
  color: {type: String, default:'#333333'},
})
</script>