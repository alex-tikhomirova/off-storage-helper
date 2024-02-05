<script setup>
import {ref} from "vue";
import {api} from "../helper.js";
import IconCheck from "../components/icons/IconCheck.vue";
import router from "../router/index.js";
import IconXmark from "../components/icons/IconXmark.vue";
import {shortDateTime} from "../helpers/datetime.js";
import {useSystemStore} from "../stores/system.js";
import IconMinus from "../components/icons/IconMinus.vue";
import RadioButtons from "../components/ui/RadioButtons.vue";
import XPanel from "../components/ui/XPanel.vue";
import PaginationComponent from "../components/ui/PaginationComponent.vue";
import createFilter from "./../helpers/filter.js";


const system = useSystemStore()
system.title = `Заказы на сборку`


const list = ref([])
const pages = ref({
  page: 1,
})

const filterData = {
  status_id: '',
  owner: ''
}
const loadOrders = (data) => {
  api().post('/warehouse/order/list', data).then(response => {
    list.value = response.items
    pages.value.page = response._meta.pageCount
    pages.value.total = response._meta.totalCount
    pages.value.perpage = response._meta.perPage
  })
}
const worker = createFilter(filterData, loadOrders)


const options = {
  owner: [{id: '', value: 'Мои'}, {id: '1', value: 'Все'}],
  status: [{id: '1', value: 'Все'}, {id: '', value: 'Несобранные'}],
}
</script>

<template>
  <div class="order-collect-view">

    <XPanel>
      <div class="filter">
        <RadioButtons :options="options.status" option-label="value" v-model="worker.query.filter.status_id"/>
        <RadioButtons :options="options.owner" option-label="value" v-model="worker.query.filter.owner"/>
      </div>
    </XPanel>

    <XPanel>
    <div class="order-list">
      <div class="item header">
        <div>№ заказа</div>
        <div>№ документа</div>
        <div>Открыт/Закрыт</div>
        <div></div>
      </div>
      <div class="item " v-for="item in list" :class="{collected: item.status_id}">
        <div class="order-number link" @click="router.push(`/order-collect/${item.order_id_eas}`)">{{item.order_id_eas}}</div>
        <div class="numbers">
          <div>

            <div>{{item.doc_number_eas}}</div>
          </div>
        </div>
        <div class="dates">
          <div>{{ shortDateTime(item.created_at) }}</div>
          <div v-if="item.collected_at">{{ shortDateTime(item.collected_at) }}</div>
          <div v-else><IconMinus/></div>
        </div>
        <div class="status">
          <div class="icon">
            <IconCheck class="checked" v-if="item.status_id === 1"/>
            <IconXmark v-else/>
          </div>

        </div>



      </div>
    </div>
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


    .item{
      &.header{
        color: lighten($color, 10%);
      }
      &.collected{
        background: $background-success;
      }
      display: grid;
      grid-template-columns: 4fr 2fr 2fr 30px;
      border-bottom: 1px solid $border-color;
      align-items: center;
      >*{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 4px 5px;
        text-align: center;

       &:not(:last-child){
         border-right: 1px solid $border-color;
       }
      }
      .order-number{
        flex: 1;
        font-size: 20px;
        font-weight: bold;
        text-align: left;
      }

      .status{
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





/*
    .item{
      border-bottom: 1px solid #ccc;
      display: flex;
      .info{
        flex: 1 1 80%;
        .order-number{
          flex: 1;
          font-size: 20px;
          font-weight: bold;
        }
        .numbers{
          flex: 1;
          .title{
            color: lighten($color, 20%);
            font-size: 90%;
          }
        }
      }
      .status{
        width: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .icon{
          text-align: center;
          svg{
            fill: $color-error;
            height: 20px;
            &.check{
              fill: $color-success;
            }
          }
        }
      }

      .user{
        border-top: 1px solid #ccc;
        padding: 2px;
        align-items: center;
        display: flex;
        gap: 5px;
        word-break: break-all;
        .title{
          color: lighten($color, 20%);
          font-size: 90%;
        }
      }
    }*/
  }
}
</style>