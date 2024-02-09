<script setup>
import IconChevron from "../icons/IconChevron.vue";
import {computed} from "vue";

const props = defineProps({
  pages: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Number,
    default: 1
  },
  visibleLinks: {
    type: Number,
    default: 10
  },
  perpage: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['update:modelValue']);

const start = computed(() => {
  let start = 1
  if (props.modelValue > props.visibleLinks / 2) {
    start = props.modelValue - Math.floor(props.visibleLinks / 2)
    if ((start + props.visibleLinks) > props.pages) {
      start = props.pages + 1 - props.visibleLinks
    }
  }
  return start
})
const end = computed(() => {
  const end = start.value - 1 + props.visibleLinks
  return end > props.pages ? props.pages : end
})

const computedPages = computed(() => {
  const pages = []
  let page = start.value
  for (page; page <= end.value; page++) {
    pages.push(page)
  }
  return pages
})

const visible = computed(() => {
  const start =((props.modelValue - 1) * props.perpage) + 1
  const end = Math.min(props.perpage * (props.modelValue), props.total)
  return [start,end].join(' - ')
})

const first = () => emit('update:modelValue', 1)
const last = () => emit('update:modelValue', props.pages)
const next = () => emit('update:modelValue', ((props.modelValue + 1) > props.pages)?props.modelValue:props.modelValue + 1)
const prev = () => {
  if (props.modelValue > 1){
    emit('update:modelValue', props.modelValue - 1)
  }
}

</script>

<template>
  <div class="pagination-component">
    <div class="pagination-list" v-if="pages > 1">
<!--      <div :class="{active: modelValue === 1}" @click="first">
        <IconChevron :rotate="0"/>
      </div>-->
      <div :class="{active: modelValue === 1}" @click="prev">
        <IconChevron :rotate="90"/>
      </div>
      <div v-for="pageNumber in computedPages"
           :class="{active: pageNumber === modelValue}" @click="emit('update:modelValue', pageNumber)">
        {{ pageNumber }}
      </div>
      <div :class="{active: modelValue === pages}" @click="next">
        <IconChevron :rotate="270"/>
      </div>
<!--      <div :class="{active: modelValue === pages}" @click="last">
        <IconChevron :rotate="180"/>
      </div>-->
    </div>
    <div class="summary">
      {{visible}} из {{total}}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './../../scss/variables.scss';
.pagination-component{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-list {
  display: flex;

  > div {
    border: 1px solid #CCCCCC;

    &:not(:last-child) {
      border-right-width: 0;
    }

    &:first-child {
      border-radius: 4px 0 0 4px;
    }

    &:last-child {
      border-radius: 0 4px 4px 0;
    }

    padding: 8px 14px;
    color: $link-color;
    svg{
      fill: $link-color;
    }
    &.active {
      color: lighten($color, 40%);
      background: $body-background;

    }
  }
}
</style>