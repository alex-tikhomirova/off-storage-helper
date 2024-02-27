<script setup>

</script>

<template>
  <div class="flex-tbl">
    <slot/>
  </div>
</template>

<style lang="scss">
@import './../../scss/variables.scss';
.flex-tbl {
  display: flex;
  justify-content: center;
  &:not(:last-child) {
    border-bottom: 1px solid $border-color;
  }
}
</style>