<template>
  <div class="radio-buttons">
    <div v-for="option in options" class="bt" @click="() => change(option)" :class="{active: activeOption === option}">{{ optionStringify(option) }}</div>
  </div>
</template>

<script setup>

import {computed} from "vue";

const props = defineProps({
  options: {
    type: Array
  },
  modelValue: {
    type: String,
    default: ''
  },
  optionLabel: {
    type: String,
  },
  optionValue: {
    type: [String, Number],
    default: 'id'
  },
})
const emit = defineEmits(['update:modelValue']);
const activeOption = computed(() => props.options.reduce((c,option) => optionValue(option) === props.modelValue?option:c))



const change = (option) => {
  emit('update:modelValue', optionValue(option))
}


const optionStringify = (option) => option?((typeof option === 'string')?option:(option[props.optionLabel] || JSON.stringify(option))):''
const optionValue = (option) => (typeof option === 'string')?option:option[props.optionValue]


</script>

<style scoped lang="scss">
.radio-buttons{
  display: flex;

  .bt{
    background-color: #f3f3f3;
    border: 1px solid #b3b3b3;
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8px 14px;
    &:hover{
      background-color: #e6e6e6;
    }

    border-radius: 0;
    &.active{

      background-color: #e6e6e6;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
      &:hover{
        background-color: #dddddd;
      }
    }
    &:first-child{
      border-radius: 4px 0 0 4px;
    }
    &:last-child{
      border-radius: 0 4px 4px 0;
    }
  }

}
</style>