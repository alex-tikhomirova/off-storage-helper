<script setup>
  defineProps({
    title: String
  })
</script>

<template>
  <div class="xpanel">
    <div v-if="title" class="xpanel-title">{{title}}</div>
    <div class="xpanel-body">
      <slot/>
    </div>

  </div>
</template>

<style  lang="scss">
@import './../../scss/variables.scss';
  .xpanel{
    background: #ffffff;
    margin: 20px 0;
    border: 1px solid #E6E9ED;
    .xpanel-title{
      font-size: 16px;
      border-bottom: 1px solid #ccc;
      padding: 10px;
      background: rgba(35, 122, 151, 0.07);
    }
    .xpanel-body{
      padding: 10px;
    }
  }
</style>