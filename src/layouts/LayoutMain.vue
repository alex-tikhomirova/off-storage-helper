<script setup>
import IconChevron from "../components/icons/IconChevron.vue";

import {useRoute, useRouter} from "vue-router";
import IconBars from "../components/icons/IconBars.vue";
import BtnStd from "../components/ui/BtnStd.vue";
import {useSystemStore} from "../stores/system.js";
import AlertBox from "../components/alert/AlertBox.vue";
import {ref, watch} from "vue";
import {api} from "../helper.js";

const router = useRouter()

const system = useSystemStore()
const menuOpened = ref(false)
const route = useRoute()

watch(() => route.path, () => menuOpened.value = false)

const logout = (e) => {
  e.preventDefault()
  api().post('user/logout').then(() => {
   // system.$reset()
    system.loadUser().then(() => router.push('/login'))

  })
}
</script>

<template>
  <div class="layout-header">
    <BtnStd @click="router.back()"><IconChevron :rotate="90" :height="14"/></BtnStd>
    <div class="page-title">
      {{system.title}}
    </div>
    <BtnStd @click="menuOpened = !menuOpened"><IconBars :height="14"/></BtnStd>
    <div class="menu-header" v-if="menuOpened">
      <router-link class="item" to="/order-collect" v-if="system.can('order-collect')">Сборка заказов</router-link>
      <router-link class="item" to="/conversation/questions" v-if="system.can('conversation')">Вопросы и ответы</router-link>
      <router-link class="item" to="/conversation/reviews" v-if="system.can('conversation')">Отзывы о товарах</router-link>
      <a class="item" href="#" @click="logout">Выход</a>
    </div>
  </div>
  <AlertBox/>
  <div class="view-wrapper">
    <router-view/>
  </div>
</template>

<style scoped lang="scss">
@import "./../scss/variables.scss";
.layout-header{
  position: relative;
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
  
  .menu-header{
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 5px;
    min-width: 400px;
    background: #fff;
    border: 1px solid $border-color;
    border-radius: 4px;
    .item{
      display: block;
      text-decoration: none;
      padding: 10px 20px;
      text-align: right;

      &:not(:last-child){
        border-bottom: 1px solid $border-color;;
      }
    }
  }

}
.view-wrapper{
  margin: 20px 10px;
}
</style>