<script setup>


import {useSystemStore} from "../stores/system.js";

const system = useSystemStore()
system.title = `Главная`


</script>

<template>
<div class="home-view">
  <div class="section-links">
    <router-link to="order-collect" v-if="system.can('order-collect')">Сборка заказов</router-link>
    <router-link to="/conversation" v-if="system.can('conversation')">Общение с покупателями</router-link>
  </div>
</div>
</template>

<style lang="scss">
@import './../scss/variables.scss';
.section-links{
  margin: auto;
  width: 100%;
  max-width: 500px;
  a{
    background: $primary-color;
    border: 1px solid darken($primary-color, 10%);
    display: block;
    color: #ffffff !important;
    margin: 30px auto;
    padding: 30px;
    text-align: center;
    text-decoration: none;
    font-size: 150%;
  }
}
</style>