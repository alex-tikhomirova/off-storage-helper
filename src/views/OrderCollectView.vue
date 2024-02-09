<script setup>
import {ref} from "vue";
import {api} from "../helper.js";
import IconCheck from "../components/icons/IconCheck.vue";
import router from "../router/index.js";
import IconXmark from "../components/icons/IconXmark.vue";

import {useSystemStore} from "../stores/system.js";

import RadioButtons from "../components/ui/RadioButtons.vue";
import XPanel from "../components/ui/XPanel.vue";
import PaginationComponent from "../components/ui/PaginationComponent.vue";
import createFilter from "./../helpers/filter.js";
import IconBox from "../components/icons/IconBox.vue";


const system = useSystemStore()
system.title = `Заказы на сборку`


const list = ref([])
const pages = ref({
  page: 1,
})

const filterData = {
  status_id: '0',
  my_own: '1'
}
const loadOrders = (data) => {
  api().post('/warehouse/order/list?expand=marketplace', data).then(response => {
    list.value = response.items
    pages.value.page = response._meta.pageCount
    pages.value.total = response._meta.totalCount
    pages.value.perpage = response._meta.perPage
  })
}
const worker = createFilter(filterData, loadOrders)


const options = {
  my_own: [{id: '1', value: 'Мои'}, {id: '0', value: 'Все'}],
  status: [{id: '-1', value: 'Все'}, {id: '0', value: 'Несобранные'}/*, {id: '1', value: 'Неупакованные'}*/],
}
</script>

<template>
  <div class="order-collect-view">

    <XPanel>
      <div class="filter">
        <RadioButtons :options="options.status" option-label="value" v-model="worker.query.filter.status_id"/>
        <RadioButtons :options="options.my_own" option-label="value" v-model="worker.query.filter.my_own"/>
      </div>
    </XPanel>

    <XPanel>
      <table class="table order-list">
        <thead>
        <tr>
          <th>№ заказа</th>
          <th>№ док-та</th>
          <th>МП</th>
          <th>Собирает</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in list" :class="{collected: item.status_id}">
          <td><div class="order-number link" @click="router.push(`/order-collect/${item.order_id_eas}`)">{{item.order_id_eas}}</div></td>
          <td class="small"> <div>{{Number(item.doc_number_eas)}}</div></td>
          <td>
            <div class="small" v-if="item.marketplace">{{ item.marketplace.type }}</div>
          </td>
          <td>
            <div class="small">{{ item.wh_username }}</div>
          </td>
          <td class="status">
            <div class="icon">
              <IconBox class="checked" v-if="item.status_id === 2"/>
              <IconCheck class="checked" v-else-if="item.status_id === 1"/>
              <IconXmark v-else/>
            </div>
          </td>
        </tr>
        </tbody>
      </table>



    </XPanel>
    <XPanel>
      <PaginationComponent v-model="worker.query.page" :pages="pages.page" :visible-links="5" :total="pages.total" :perpage="pages.perpage"/>
    </XPanel>
  </div>

</template>

<style  lang="scss">
@import './../scss/variables.scss';
.order-collect-view{
  .filter{
    display: flex;
    justify-content: space-between;

  }
  .order-list{
    thead{
      color: lighten($color, 10%);
      font-size: 80%;
    }
    tbody{
      tr.collected td{
        background: $background-success;
      }
      td{
        .order-number{
          font-size: 120%;
          font-weight: bold;
        }
        &.status{
          .icon {
            text-align: center;

            svg {
              fill: $color-error;
              height: 20px;

              &.checked {
                fill: $color-success;
              }
            }
          }
        }
      }
    }

  }
}
</style>