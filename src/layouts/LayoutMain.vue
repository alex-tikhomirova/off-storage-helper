<script setup>
import IconChevron from "../components/icons/IconChevron.vue";

import {useRouter} from "vue-router";
import IconBars from "../components/icons/IconBars.vue";
import BtnStd from "../components/ui/BtnStd.vue";
import {useSystemStore} from "../stores/system.js";
import AlertBox from "../components/alert/AlertBox.vue";

const router = useRouter()

const system = useSystemStore()

</script>

<template>
  <div class="layout-header">
    <BtnStd @click="router.back()"><IconChevron :rotate="90" :height="14"/></BtnStd>
    <div class="page-title">
      {{system.title}}
    </div>
    <BtnStd><IconBars :height="14"/></BtnStd>
  </div>
  <AlertBox/>
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

}
.view-wrapper{
  margin: 20px 10px;
}
</style>