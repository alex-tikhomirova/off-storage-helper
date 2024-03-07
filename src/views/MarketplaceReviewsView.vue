<script setup>

import FilterMarketplace from "../components/ui/FilterMarketplace.vue";
import XPanel from "../components/ui/XPanel.vue";
import RadioButtons from "../components/ui/RadioButtons.vue";
import PaginationComponent from "../components/ui/PaginationComponent.vue";
import MarketplaceReview from "./markeplaceReview/MarketplaceReview.vue";
import {useSystemStore} from "../stores/system.js";
import {ref} from "vue";
import {api} from "../helper.js";
import createFilter from "../helpers/filter.js";


const system = useSystemStore()
system.title = `Отзывы о тоаврах`

const list = ref([])
const pages = ref({
  page: 1,
})

const filterData = {
  marketplace_id: [],
  not_answered: '1',
  not_empty: '1'
}
const loadOrders = (data) => {
  api().post('/conversation/review/list?expand=answers,marketplace,product', data).then(response => {
    list.value = response.items
    pages.value.page = response._meta.pageCount
    pages.value.total = response._meta.totalCount
    pages.value.perpage = response._meta.perPage
  })
}
const worker = createFilter(filterData, loadOrders)
</script>

<template>
  <div class="marketplace-reviews-view">
    <XPanel>
      <div class="filter">
        <FilterMarketplace v-model="worker.query.filter.marketplace_id"/>
        <RadioButtons :options="[{id: '1', value: 'Без ответов'}, {id: '', value: 'Все'}]" option-label="value" v-model="worker.query.filter.not_answered"/>
        <RadioButtons :options="[{id: '1', value: 'С текстом'}, {id: '', value: 'Все'}]" option-label="value" v-model="worker.query.filter.not_empty"/>
      </div>

    </XPanel>

      <MarketplaceReview v-for="review in list" :key="review.uuid" :review="review" @updated="loadOrders" class="marketplace-review"/>
    <XPanel>
      <PaginationComponent v-model="worker.query.page" :pages="pages.page" :visible-links="5" :total="pages.total" :perpage="pages.perpage"/>
    </XPanel>
  </div>
</template>

<style lang="scss">
.marketplace-reviews-view{
  max-width: 900px;
  margin: auto;

  .xpanel{
    padding: 15px;
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