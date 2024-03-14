<script setup>

</script>

<template>
  <button type="button"><slot/></button>
</template>

<style  lang="scss">


@import './../../scss/variables.scss';

$background: $primary-color;
button{
  $text-color: #ffffff;
  background:  $background;
  color: $text-color;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 2px  #000000;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  gap: 5px;
  &.default{
    background: $color-default;
    color: $color;
  }
  &.success{
    background: $color-success;
  }
  &.warning{
    background: $color-warning;
  }
  &[disabled]{
    background:  lighten($background, 20%);
    cursor: not-allowed;
    box-shadow: none;
    color: darken($text-color,10%);
    svg{
      fill: darken($text-color,10%);
    }
  }
  &.active,:active{
    background:  darken($background, 5%);
    box-shadow: inset 2px 2px 3px #000000;
    color: darken($text-color,10%);
    svg{
      fill: darken($background,20%);
      height: 14px;
    }
  }

  svg{
    fill: $text-color;
  }
  &.default{
    svg{
      fill: $color;
    }
  }
}
</style>