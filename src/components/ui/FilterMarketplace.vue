<template>
  <InputSelectable :options="options" @focus="loadOptions" option-text="title" v-model="val" :multiple="true" :visible-options="999"  @update:modelValue="update"/>
</template>

<script setup>

import {ref} from "vue";
import InputSelectable from "./InputSelectable.vue";
import {api} from "../../helper.js";


const props = defineProps({
  modelValue: Array
})
const emit = defineEmits(['update:modelValue'])
const val = ref([])
const options = ref([])

const loadOptions = () => {

  if (!options.value.length) {
    api().get('marketplace/list').then(data => {
      options.value = data
      val.value = options.value.filter(item => props.modelValue.includes(String(item.id)))
    })
  }
}
if (props.modelValue.length){

  loadOptions()

}

const update = (value) => emit('update:modelValue', value.map(item => item.id))


</script>

<style scoped>

</style>