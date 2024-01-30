<script setup>
import IconChevron from "../components/icons/IconChevron.vue";

import {useRoute, useRouter} from "vue-router";
import IconBars from "../components/icons/IconBars.vue";

const router = useRouter()
const route = useRoute()

</script>

<template>
  <div class="layout-header">

      <div class="button" @click="router.back()"><IconChevron :rotate="90" :height="14"/></div>

    <div class="page-title">
      {{route.meta.title}}
    </div>
    <div class="button"><IconBars :height="14"/></div>
  </div>
  <div class="view-wrapper">
    <router-view/>
  </div>
</template>

<style scoped lang="scss">
@import "./../scss/variables.scss";
.layout-header{

  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  background:  $primary-color;
  box-shadow: 0 1px 1px 1px darken($primary-color, 10%);
  svg{
    fill: #ffffff;
  }
  .button{

    box-shadow: 0 0 2px  #000000;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
}
.view-wrapper{
  margin: 20px 10px;
}
</style>