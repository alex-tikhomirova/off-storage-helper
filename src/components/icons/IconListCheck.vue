<template>
  <svg :height="height" :fill="color" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
    <g>
      <path d="M0,65.88h337.01v61.27H0V65.88z M0,188.43h337.01v61.27H0V188.43z M0,310.98h214.46v61.27H0V310.98z M468.74,228.01
        L336.98,359.47l-39.58-39.55l-43.29,43.35l82.88,82.85L512,271.39L468.74,228.01z"/>
    </g>
</svg>
</template>

<script setup>
defineProps({
  height: {type: Number, default:12},
  color: {type: String, default:'#333333'},
})
</script>