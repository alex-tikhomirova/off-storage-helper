<script setup>


import {useSystemStore} from "../stores/system.js";

const system = useSystemStore()
system.title = `Главная`


</script>

<template>
<div class="home-view">
  <router-link to="order-collect">Сборка</router-link>
</div>
</template>

<style scoped>

</style>