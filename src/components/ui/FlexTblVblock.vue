<script setup>
defineProps({label: String})
</script>

<template>
  <div class="flex-tbl-vblock">
    <label>{{ label }}</label>
    <div class="value">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss">
@import './../../scss/variables.scss';
.flex-tbl-vblock{
  text-align: center;
  padding: 10px 5px;

  &:not(:last-child){
    border-right: 1px solid $border-color;
  }
  label{
    color: lighten($color, 20%);
    font-size: 80%;
    display: block;
    margin-bottom: 5px;
  }
  &.primary .value{
    color: $primary-color;
  }
  &.error .value{
    color: $color-error;;
  }
  &.success .value{
    color: $color-success;;
  }

  .value{
    font-weight: bold;
  }
}

</style>