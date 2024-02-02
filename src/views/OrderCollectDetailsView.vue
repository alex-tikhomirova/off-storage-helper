<script setup>

import BtnStd from "../components/ui/BtnStd.vue";
import {computed, reactive, ref, watch} from "vue";

import IconCheck from "../components/icons/IconCheck.vue";
import {api} from "../helper.js";
import {useRoute} from "vue-router";
import IconXmark from "../components/icons/IconXmark.vue";
import XPanel from "../components/ui/XPanel.vue";
import {useSystemStore} from "../stores/system.js";
import IconBarcode from "../components/icons/IconBarcode.vue";
import scan_ok from './../assets/scan_ok.mp3'
import scan_not_ok from './../assets/scan_not_ok.mp3'
import BarcodeScanner from "../components/util/BarcodeScanner.vue";

const system = useSystemStore()
const route = useRoute()
system.title = `Сборка заказа: ${route.params.id}`

const soundOK = new Audio(scan_ok);
const soundFail = new Audio(scan_not_ok);

const order = ref(null)
const canEdit = ref(false)
const finished = ref(false)

const scanMode = ref(false)
const barcodes = reactive({})


const remainTotal = computed(() => {
  let qty = 0, scan = 0
  for (let item of Object.entries(barcodes)) {
    qty += item[1].quantity
    scan += item[1].scanned
  }
  return qty - scan
})


const loadOrder = () => api().post(`/warehouse/order/item?expand=items,marketplace`, {order_id_eas: route.params.id}).then(data => order.value = data)
watch(() => order.value, (value) => {
  canEdit.value = system.user.username === order.value.wh_username
  finished.value = true
  for (let item of value.items) {
    if (Number(item.scanned) !== item.quantity){
      finished.value = false
    }
    barcodes[item.barcode] = {
      barcode: item.barcode,
      product_id: item.product_id,
      scanned: Number(item.scanned),
      quantity: item.quantity,
    }
  }
})


const setAttribute = (attribute, value) => {
  api().post(`/warehouse/order/set-attribute`, {order_id_eas: order.value.order_id_eas, attribute: attribute, value: value}).then(loadOrder)
}

const collect = () => setAttribute('status', 1)
const unCollect = () => {
  if (confirm('Уверены???')){
    setAttribute('status', 0)
  }
}

const setScan = () => api().post(`/warehouse/order/set-scan`, {order_id_eas: order.value.order_id_eas, barcodes: barcodes}).then(loadOrder)

let scanTimeout = null

const scan = (barcode) => {
  if (!order.value.status) {
    if (barcodes[barcode] && barcodes[barcode].scanned < barcodes[barcode].quantity) {
      soundOK.play()
      barcodes[barcode].scanned += 1
      if (scanTimeout) {
        clearTimeout(scanTimeout)
      }
      scanTimeout = setTimeout(setScan, 1000)
    } else {
      soundFail.play()
    }
  }
}

const reset = (product_id) => {
  if (!order.value.status && canEdit && confirm('Уверены???')){
    for (let item of Object.entries(barcodes)) {
      if (product_id === item[1].product_id){
        barcodes[item[0]].scanned = 0
      }
    }
    setScan()
  }
}

loadOrder()



</script>

<template>
  <div class="order-collect">

    <XPanel v-if="order" >
      <div class="collect-top">
        <div class="left">
          <div class="item"><div class="title">№ заказа</div> {{order.order_id_eas}}</div>
          <div class="item"><div class="title">№ док-та</div> {{Number(order.doc_number_eas)}}</div>
          <div class="item"><div class="title">№ на МП:</div> {{order.order_number_mp}}</div>
          <div class="item"><div class="title">МП:</div> {{order.marketplace.title.slice(0, 30)}}</div>
          <div class="item"><div class="title">Создан:</div> {{order.created_at}}</div>
          <div class="item"><div class="title">Собирает:</div> {{order.wh_username}}</div>
          <div class="item" v-if="order.collected_at"><div class="title">Собран:</div> {{order.collected_at}}</div>

        </div>
        <div class="right">
          <BtnStd v-if="canEdit && !order.status" @click="scanMode = !scanMode" :class="{active: scanMode}">
            <IconBarcode :height="40"/>
          </BtnStd>
          <div class="summary">Осталось: <div class="count" :class="{success: !remainTotal}">{{ remainTotal }}</div>    </div>
        </div>
      </div>
    </XPanel>
    <BarcodeScanner @decode="scan" v-if="scanMode"/>
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
            <div class="flex-tbl counters" :class="{multi: item.quantity>1, success: barcodes[item.barcode].scanned === item.quantity}">
              <div class="vblock barcode"><label>Штрихкод</label><div class="value" @click="() => scan(item.barcode)">{{ item.barcode }}</div> </div>
              <div class="vblock qty"><label>Кол-во</label><div class="value">{{ item.quantity }}</div> </div>
              <div class="vblock scan" @click="() => reset(item.product_id)"><label>Считано</label><div class="value" >{{ Number(item.scanned) }}</div> <div class="reset" v-if="!order.status"><IconXmark/></div></div>
            </div>
          </div>
          <div class="image">
            <img src="https://www.globusoff.ru/images/product/mid/71223.jpg" alt="">
          </div>
        </div>

      </XPanel>
    </div>


    <div class="actions" v-if="canEdit">
      <BtnStd @click="unCollect" v-if="order.status"><IconXmark color="#ffffff"/> Разобрать заказ</BtnStd>
      <BtnStd @click="collect" :disabled="!finished" v-else><IconCheck color="#ffffff"/> Заказ собран</BtnStd>
    </div>

  </div>
</template>

<style  lang="scss">
@import './../scss/variables.scss';


@mixin round-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-error;
  color: #fff;
  border: 2px solid darken($color-error, 10%);
  border-radius: 100%;
  margin: auto;
  &.success{
    background: $color-success;
    border-color: darken($color-success, 10%);
  }
}

.order-collect{

  .collect-top{
    display: flex;
    justify-content: space-between;
    .left{
      flex: 1;
      .item{
        margin: 5px 0;
        .title{
          color: lighten($color, 20%);
          font-size: 80%;
        }
      }
    }
    .right{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
    .summary{
      font-weight: bold;
      .count{
        @include round-counter;
        font-size: 22px;
        width: 50px;
        height: 50px;
        margin: 20px auto 0 auto;
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

          &.counters{
            &.multi .qty .value{
              color: $primary-color;
              font-size: 20px;
              text-decoration: underline;
            }
            .scan {
              position: relative;
              .reset{
                position: absolute;
                top: 2px;
                right: 2px;
                z-index: 1;
              }
              .value{
                @include round-counter;
                width: 25px;
                height: 25px;
                color: #ffffff;
              }
            }
            &.success {
              .qty .value{
                color: $color-success;
              }
              .scan .value{
                background: $color-success;
                border-color: darken($color-success, 10%);
              }
            }
          }


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

    }
  }
  .actions{
    margin: 30px 0;
    display: flex;
    justify-content: center;
  }
}
</style>