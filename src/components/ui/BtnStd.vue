<script setup>

</script>

<template>
  <button type="button"><slot/></button>
</template>

<style  lang="scss">


@import './../../scss/variables.scss';
$color: #ffffff;
$background: $primary-color;
button{
  background:  $background;
  color: $color;
  border: none;
  box-shadow: 0 0 2px  #000000;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  gap: 5px;
  &.success{
    background: $color-success;
  }
  &.warning{
    background: $color-warning;
  }
  &[disabled]{
    background:  lighten($background, 20%);
    box-shadow: none;
    color: darken($color,10%);
    svg{
      fill: darken($color,10%);
    }
  }
  &.active,:active{
    background:  darken($background, 5%);
    box-shadow: inset 2px 2px 3px #000000;
    color: darken($color,10%);
    svg{
      fill: darken($background,20%);
      height: 14px;
    }
  }
  svg{
    fill: $color;
  }
}
</style>