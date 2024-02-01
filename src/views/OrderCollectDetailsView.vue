<script setup>

import BtnStd from "../components/ui/BtnStd.vue";
import {computed, ref} from "vue";

import IconCheck from "../components/icons/IconCheck.vue";
import {api} from "../helper.js";
import {useRoute} from "vue-router";
import IconXmark from "../components/icons/IconXmark.vue";
import XPanel from "../components/ui/XPanel.vue";
import {useSystemStore} from "../stores/system.js";
const scanMode = ref(false)
const order = ref(null)
const route = useRoute()

const system = useSystemStore()
system.title = `Сборка заказа: ${route.params.id}`

const total = computed(() => (order.value?order.value.items:[]).reduce((total, item) => total + item.quantity, 0))

const loadOrder = () => api().post(`/warehouse/order/item?expand=items`, {order_id_eas: route.params.id}).then(data => order.value = data)

const setCollected = () => {
  api().post(`/warehouse/order/set-attribute`, {order_id_eas: order.value.order_id_eas, attribute: 'status', value: 1}).then(loadOrder)
}

loadOrder()

</script>

<template>
  <div class="order-collect">





    <XPanel v-if="order" >
      <div class="collect-top">
        <div class="summary">Всего товаров в заказе: <strong>{{ total }}</strong>    </div>
        <BtnStd @click="scanMode = !scanMode">{{scanMode?'Завершить сканирование':'Сканировать ШК'}}</BtnStd>
      </div>
      <div>Создан: {{order.created_at}}</div>
      <div>Собирает: {{order.wh_username}}</div>
      <div>Собран в {{order.collected_at}}</div>
      <div>Собран {{order.collected_by}}</div>
      <div>№ док-та {{order.doc_number_eas}}</div>
      <IconCheck class="check" v-if="order.status === 1"/>
      <IconXmark v-else/>
    </XPanel>

    <div class="items">
      <XPanel class="item" v-if="order" v-for="item in order.items" :title="item.product_name">
        <div class="main">
          <div class="info">





            <div class="flex-tbl code">
              <div class="vblock"><label>Код</label><div class="value">{{ item.product_id }}</div> </div>
              <div class="vblock"><label>Код поставщика</label><div class="value">{{ item.vendor_code }}</div> </div>
            </div>
            <div class="flex-tbl place">
              <div class="vblock"><label>Место</label><div class="value">{{ item.store_place }}</div> </div>
            </div>
            <div class="flex-tbl qty">
              <div class="vblock barcode"><label>Штрихкод</label><div class="value">{{ item.barcode }}</div> </div>
              <div class="vblock"><label>Кол-во</label><div class="value">{{ item.quantity }}</div> </div>
              <div class="vblock"><label>Считано</label><div class="value" :class="{error:  item.scanned < item.quantity}">{{ item.scanned||0 }}</div> </div>
            </div>
          </div>
          <div class="image">
            <img src="https://www.globusoff.ru/images/product/mid/71223.jpg" alt="">
          </div>
        </div>

      </XPanel>
    </div>


    <div class="actions">
      <BtnStd @click="setCollected"><IconCheck color="#ffffff"/> Заказ собран</BtnStd>
    </div>

  </div>
</template>

<style  lang="scss">
@import './../scss/variables.scss';
.order-collect{

  .collect-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .summary{
      strong{
        color: $color-error;
      }
    }
  }
  .items{
    margin: 10px 0;
    .item{
      margin: 10px 0;
      border: 1px solid $border-color;
      .xpanel-title{
        font-size: 90%;
      }
      &:not(:first-child){

      }

      .title{
        border-bottom: 1px solid $border-color;
        display: flex;
        padding: 7px 5px 5px 5px;
        font-size: 12px;
      }
      .main{
        display: flex;
        .info{
          flex: 2;
          display: flex;
          flex-direction: column;
          border-right: 1px solid $border-color;
        }
        .flex-tbl{
          display: flex;
          justify-content: space-between;

          &:not(:last-child) .vblock{
            border-bottom: 1px solid $border-color;
          }
          .vblock{
            text-align: center;
            flex: 1;
            padding: 10px 5px;

            &.barcode{
              flex: 2;
            }
            &:not(:last-child){
              border-right: 1px solid $border-color;
            }
            label{
              color: lighten($color, 20%);
              font-size: 80%;
              display: block;
              margin-bottom: 5px;
            }
            .value{
              font-weight: bold;
              .error{
                color: $color-error;;
              }
            }
          }
        }
        .image{
          flex: 1;
          height: 160px;
          text-align: center;
          img{
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
/*      .info{
        display: flex;
        width: 100%;
        justify-content: space-between;


        .block{

          &.image{
            display: flex;
            justify-content: flex-end;
          }
          flex: 1;
          text-align: center;
          border-collapse: collapse;
          label{
            font-size: 12px;
            display: block;
            margin-bottom: 5px;
          }
          .value{
            font-weight: bold;
          }
        }
      }*/

    }
  }
  .actions{
    margin: 30px 0;
    display: flex;
    justify-content: center;
  }
}
</style>