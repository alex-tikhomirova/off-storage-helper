<template>
</template>
<script setup>
import {onMounted, onUnmounted} from "vue";

const emit = defineEmits(['decode'])

let value = ''
let timeout = null
const trigger = (e) => {
  clearTimeout(timeout)
  value += String.fromCharCode(e.charCode)
   timeout = setTimeout(()=>{
   emit('decode', value.trim())
   value = ''
  }, 100)

}

onMounted(() => window.addEventListener('keypress', trigger))
onUnmounted(() => window.removeEventListener('keypress', trigger))
</script>
