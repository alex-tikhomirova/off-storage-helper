<script setup>

</script>

<template>
  <button type="button"><slot/></button>
</template>

<style  lang="scss">
$background: #237a97;
$color: #ffffff;
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
  &[disabled]{
    background:  lighten($background, 20%);
    box-shadow: none;
    color: darken($color,10%);
    svg{
      fill: darken($color,10%);
    }
  }
  svg{
    fill: $color;
  }
}
</style>