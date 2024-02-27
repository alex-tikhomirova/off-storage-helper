<template>
  <div class="system-alert-box">
    <div class="alert-wrapper">
      <Alert v-for="(message, index) in system.messages" :type="message.type" :showTitle="showTitle" :text="message.message" @close="system.removeMessage(index)"/>
    </div>
  </div>
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
.system-alert-box{
  position: fixed;
  top: 50px;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
}
</style>
