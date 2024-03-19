<script setup>

import XPanel from "./ui/XPanel.vue";
</script>

<template>
  <div class="section-links">
    <XPanel>
      <slot/>
    </XPanel>

  </div>
</template>

<style  lang="scss">
@import './../scss/variables.scss';
.section-links{
  position: absolute;
  right: 100%;
  margin-right: 30px;
  width: 250px;
  top: 0;
  .xpanel{
    margin: 0;
  }
  .item{
    background: $primary-color;
    border: 1px solid darken($primary-color, 10%);
    display: block;
    color: #ffffff ;
    margin: 15px auto;
    padding: 6px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
   &.active{
     background: #ffffff !important;;
     color: $primary-color;
     cursor: default;
   }
  }
}
</style>