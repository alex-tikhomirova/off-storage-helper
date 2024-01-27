<template>
   <Alert v-for="(message, index) in system.messages" :type="message.type" :showTitle="showTitle" :text="message.message" @close="system.removeMessage(index)"/>
</template>

<script setup>
import {useSystemStore} from "../../stores/system";
import Alert from "./Alert.vue";

const system = useSystemStore()
defineProps({
  showTitle: {
    type: Boolean,
    default: true
  }
})
</script>

<style>
</style>
