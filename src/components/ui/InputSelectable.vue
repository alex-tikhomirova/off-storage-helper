<template>

  <div class="input-selectable" :class="{'dropped': dropped}" ref="element" @keydown="keydown">
    <div v-bind="$attrs" class="input" @click="focus">
      <div class="values" v-if="multiple">
        <span v-if="!modelValue || !modelValue.length">&nbsp;</span>
        <div v-if="multiple" class="value" v-for="item in modelValue">
          {{ optionStringify(item) }} <span @click="() => remove(item)" class="remove"><IconXmark/></span>
        </div>
      </div>
      <div class="searchbox">
        <input v-if="dropped" type="text" ref="searchInput" placeholder="Введите текст для поиска" v-model="search" @input="input"/>
        <input v-else-if="!multiple" type="text" @focus="focus" :value="optionStringify(modelValue)"/>
      </div>
    </div>
    <div class="dropdown" v-if="dropped" >
      <div v-for="option in filteredOptions" :class="['option', {'active': activeOption === option}]"
           @click="() => selectItem(option)" @mouseenter="activeOption = option" ref="optionsRef">{{ optionStringify(option) }}
      </div>
      <div v-if="showAddnew" class="option new" @click="onAddNew">
        Добавить <span class="value">{{ search }}</span>
      </div>
    </div>

  </div>
</template>
<script setup>

import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import IconXmark from "./../icons/IconXmark.vue";

const props = defineProps({
  modelValue: {
    type: [ String, Array, Object],
    default: null
  },
  options: {
    type: Array,
    default: []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  addNew: {
    type: Boolean,
    default: false
  },
  customValue: {
    type: Boolean,
    default: false
  },
  visibleOptions: {
    type: Number,
    default: 10
  },
  optionText: String,
});

const emit = defineEmits(['update:modelValue', 'selectItem', 'input', 'focus', 'blur', 'add-new']);
/* Рефы элементов */
const element = ref(null);
const searchInput = ref(null);
const optionsRef = ref([]);

/* реактивные данные */
const activeOption = ref(null)
const dropped = ref(false)
const search = ref('');
if (props.customValue){
  search.value = props.modelValue
}

watch(() => searchInput.value, () => {
  if (searchInput.value) {
    searchInput.value.focus()
    if (!props.options.length) {
      emit('input')
    }

  }
})

const optionStringify = (option) => option ? ((typeof option === 'string') ? option : (option[props.optionText] || JSON.stringify(option))) : ''


const filteredOptions = computed(() => {
  const options = props.options
      .filter((el) => {
        if (!props.modelValue) {
          return true
        } else {
          if (Array.isArray(props.modelValue)) {
            return !props.modelValue.includes(el)
          } else {
            return optionStringify(el).toLowerCase() !== optionStringify(props.modelValue).toLowerCase()
          }
        }
      })
      .filter(el => optionStringify(el).toLowerCase().indexOf(search.value.toLowerCase()) >= 0)
  if (props.visibleOptions) {
    return options.slice(0, props.visibleOptions)
  }
  return options
})


const focus = () => {
  dropped.value = true
  emit('focus')
}
const input = () => {
  emit('input', search.value)
  if (props.customValue) {
    emit('update:modelValue', search.value)
  }
}
const onAddNew = () => emit('add-new', search.value)
const showAddnew = computed(() => {
  if (!props.addNew || !search.value) {
    return false
  } else {
    return (!props.modelValue || (Array.isArray(props.modelValue) ? !props.modelValue.includes(search.value) : search.value !== optionStringify(props.modelValue)))
        && !((filteredOptions.value.length === 1) && (optionStringify(filteredOptions.value.at(0)) === search.value))
  }

})

const blur = () => {
  dropped.value = false
  emit('blur')
}
const selectItem = (option) => {
  if (option) {
    activeOption.value = option
    let val
    if (Array.isArray(props.modelValue)) {
      val = props.modelValue.slice()
      val.push(option)
    } else {
      val = option
    }

    emit('update:modelValue', val)
    emit('selectItem', option)
    if (props.multiple) {
      search.value = ''
    }
    dropped.value = false
  }
}

const remove = option => {
  if (option) {
    const val = props.modelValue.filter(el => el !== option)
    emit('update:modelValue', val)
  }
}

const currentKey = computed(() => filteredOptions.value.findIndex((e) => e === activeOption.value))

const prev = () => {
  const key = currentKey.value > 0 ? currentKey.value : filteredOptions.value.length
  activeOption.value = filteredOptions.value.at(key - 1)
}

const next = () => {
  activeOption.value = filteredOptions.value.at(currentKey.value + 1) || filteredOptions.value[0]
}

const keydown = (key) => {
  switch (key.key) {
    case 'Enter':
      key.preventDefault()
      selectItem(activeOption.value ?? null)
      break;
    case 'Escape':
      dropped.value = false
      break;
    case 'ArrowDown':
      next()
      break;
    case 'ArrowUp':
      prev()
      break;
    default:
      //input(key)
  }

}
const listenClick = (e) => {
  if (element.value && !(element.value === e.target || element.value.contains(e.target))) {
    blur()
  }

}
onMounted(() => document.body.addEventListener('click', listenClick))
onBeforeUnmount(() => document.body.removeEventListener('click', listenClick))

</script>

<style lang="scss">
.input-selectable {
  position: relative;

  .input {
    border: 1px solid #ccc;
    transition: border linear .2s, box-shadow linear .2s;
    padding: 8px 12px;
    border-radius: 3px;

  }

  &.dropped {
    .input {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;

    }
  }

  .values {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .value {
      background: #f3f4f6;
      padding: 0 8px;
      outline: 1px solid #d1d5db;
      border-radius: 5px;
      display: flex;
      gap: 8px;
      align-items: center;

      .remove {
        cursor: pointer;
        display: flex;
      }
    }
  }

  input {
    width: 100%;
    border: none;
    padding: 0;
    margin: 0;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  .dropdown {
    position: absolute;
    left: 0;
    border: 1px solid #d1d5db;
    background: #fff;
    top: 100%;
    width: calc(100% - 2px);
    z-index: 1;
    border-radius: 0 0 0.375rem 0.375rem;
    border-top: none;
    height: 200px;
    overflow: hidden auto;

    .option {
      padding: 6px 8px;
      cursor: pointer;

      &.active, &:focus {
        background: #ddd;
      }

      &.new {
        background: #fff;
        width: 100%;
        margin: 5px 0;

        .value {
          font-weight: 600;

        }
      }
    }
  }
}
</style>
