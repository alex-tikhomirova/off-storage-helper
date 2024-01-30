<script setup>

import {api} from "../helper.js";

api().get('/warehouse/order/list')
</script>

<template>
<div class="home-view">
  <router-link to="order-collect">Сборка</router-link>
</div>
</template>

<style scoped>

</style>