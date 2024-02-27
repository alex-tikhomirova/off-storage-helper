<script setup>

import {api} from "../helper.js";
import createFilter from "../helpers/filter.js";
import {ref} from "vue";
import MarketplaceQuestion from "./marketplaceQuestions/MarketplaceQuestion.vue";
import XPanel from "../components/ui/XPanel.vue";
import PaginationComponent from "../components/ui/PaginationComponent.vue";
import FilterMarketplace from "../components/ui/FilterMarketplace.vue";
import RadioButtons from "../components/ui/RadioButtons.vue";

const list = ref([])
const pages = ref({
  page: 1,
})

const filterData = {
  marketplace_id: [],
  not_answered: ''
}
const loadOrders = (data) => {
  api().post('/conversation/question/list?expand=answers,marketplace,product', data).then(response => {
    list.value = response.items
    pages.value.page = response._meta.pageCount
    pages.value.total = response._meta.totalCount
    pages.value.perpage = response._meta.perPage
  })
}
const worker = createFilter(filterData, loadOrders)
</script>

<template>
  <div class="marketplace-questions-view">
    <XPanel>
      <div class="filter">
        <FilterMarketplace v-model="worker.query.filter.marketplace_id"/>
        <RadioButtons :options="[{id: '1', value: 'Без ответов'}, {id: '', value: 'Все'}]" option-label="value" v-model="worker.query.filter.not_answered"/>
        <div></div>
      </div>

    </XPanel>
    <XPanel>
      <MarketplaceQuestion v-for="question in list" :key="question.uuid" :question="question" @updated="loadOrders" class="marketplace-questions"/>
    </XPanel>
    <XPanel>
      <PaginationComponent v-model="worker.query.page" :pages="pages.page" :visible-links="5" :total="pages.total" :perpage="pages.perpage"/>
    </XPanel>
  </div>
</template>

<style lang="scss">
  .marketplace-questions-view{
    max-width: 900px;
    margin: auto;

    .xpanel{
      padding: 30px;
    }
    .filter{
      display: flex;
      gap: 15px;
      >*{
        flex: 1;
      }
    }
  }
</style>