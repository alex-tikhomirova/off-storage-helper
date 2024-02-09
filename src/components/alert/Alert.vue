<template>
  <div class="alert" :class="'alert-'+type">
    <div>
      <div v-if="showTitle" class="alert-heading h4">{{ title }}</div>
      <div :class="'alert-'+type">{{text}}</div>
    </div>
    <div class="close"><IconXmark @click="emit('close')" color="#494F54" :height="15"/></div>
  </div>
</template>

<script setup>

import {computed, onMounted} from "vue";
import IconXmark from "../icons/IconXmark.vue";

const props = defineProps({
  type: {
    type: String
  },
  text: {
    type: String
  },
  showTitle: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['close'])

let closeTimeOut = 3 * 1000
if (props.type === 'warning'){
  closeTimeOut = 5 * 1000
}
if (props.type === 'error'){
  closeTimeOut = 10 * 1000
}

const title = computed(() => {
  switch (props.type){
    case 'error':
      return 'Ошибка'
    case 'warning':
      return 'Предупреждение'
    default:
      return 'Сообщение'
  }
})

onMounted(() => setTimeout(() => emit('close'), closeTimeOut))

</script>

<style lang="scss">
.alert {
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 50px;
  left: 0;
  border: 1px solid;
  margin: 10px;
  border-radius: 4px;
  padding: 10px;
  color: #005e14;
  background: #caebd1;
  &.alert-error{
    color: #940303;;
    background: #ffdada
  }
  &.alert-warning{
    color: #c76800;
    background: #fff3e6;
  }
  .alert-heading{
    margin-bottom: 10px;
    font-weight: bold;
  }
  .close{
    cursor: pointer;

  }
}
</style>
