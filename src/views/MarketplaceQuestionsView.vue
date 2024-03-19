<script setup>

import {api} from "../helper.js";
import createFilter from "../helpers/filter.js";
import {ref} from "vue";
import MarketplaceQuestion from "./marketplaceQuestions/MarketplaceQuestion.vue";
import XPanel from "../components/ui/XPanel.vue";
import PaginationComponent from "../components/ui/PaginationComponent.vue";
import FilterMarketplace from "../components/ui/FilterMarketplace.vue";
import RadioButtons from "../components/ui/RadioButtons.vue";
import {useSystemStore} from "../stores/system.js";
import SectionLinks from "../components/SectionLinks.vue";
import router from "../router/index.js";


const system = useSystemStore()
system.title = `Вопросы и ответы`

const list = ref([])
const pages = ref({
  page: 1,
})

const filterData = {
  marketplace_id: [],
  not_answered: '1',
  status_id: '',
}
const load = (data) => {
  api().post('/conversation/question/list?expand=answers,marketplace,product', data).then(response => {
    list.value = response.items
    pages.value.page = response._meta.pageCount
    pages.value.total = response._meta.totalCount
    pages.value.perpage = response._meta.perPage
  })
}
const worker = createFilter(filterData, load)
</script>

<template>
  <div class="marketplace-questions-view">
    <SectionLinks>
      <span @click="router.push('/conversation/questions')"  v-if="system.can('conversation')" class="item active">Вопросы покупателей</span>
      <span @click="router.push('/conversation/reviews')"  v-if="system.can('conversation')" class="item">Отзывы о товарах</span>
    </SectionLinks>
    <XPanel>
      <div class="filter">
        <FilterMarketplace v-model="worker.query.filter.marketplace_id"/>
        <RadioButtons :options="[{id: '1', value: 'Без ответов'}, {id: '', value: 'Все'}]" option-label="value" v-model="worker.query.filter.not_answered"/>
        <RadioButtons :options="[{id: '-1', value: 'Отклоненные'}, {id: '0', value: 'Новые'}, {id: '', value: 'Все'}, {id: '1', value: 'Опубликованные'}]" option-label="value" v-model="worker.query.filter.status_id"/>
      </div>

    </XPanel>
    <MarketplaceQuestion v-for="question in list" :key="question.uuid" :question="question" @updated="() => worker.reload()" class="marketplace-questions"/>
    <XPanel>
      <PaginationComponent v-model="worker.query.page" :pages="pages.page" :visible-links="5" :total="pages.total" :perpage="pages.perpage"/>
    </XPanel>
  </div>
</template>

<style lang="scss">
  .marketplace-questions-view{
    max-width: 900px;
    margin: auto;
    position: relative;
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