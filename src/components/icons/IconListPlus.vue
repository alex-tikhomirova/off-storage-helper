<template>
  <svg xmlns="http://www.w3.org/2000/svg" :height="height" :fill="color" viewBox="0 0 512 512"  xml:space="preserve">
<g>
	<path d="M426.67,298.67v-85.33h-56.89v85.33h-63.17h-22.17v56.89h22.17h63.17v85.33h56.89v-85.33h58.67H512v-56.89h-26.67H426.67z
		 M0,71.11h312.89V128H0V71.11z M0,184.89h312.89v56.89H0V184.89z M0,298.67h227.56v56.89H0V298.67z"/>
</g>
</svg>
</template>

<script setup>
defineProps({
  height: {type: Number, default:12},
  color: {type: String, default:'#333333'},
})
</script>