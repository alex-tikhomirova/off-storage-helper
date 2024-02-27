<script setup>

import BtnStd from "../components/ui/BtnStd.vue";
import {computed, reactive, ref, watch} from "vue";

import IconCheck from "../components/icons/IconCheck.vue";
import {api} from "../helper.js";
import {useRoute, useRouter} from "vue-router";
import IconXmark from "../components/icons/IconXmark.vue";
import XPanel from "../components/ui/XPanel.vue";
import {useSystemStore} from "../stores/system.js";
import IconBarcode from "../components/icons/IconBarcode.vue";
import scan_ok from './../assets/scan_ok.mp3'
import scan_not_ok from './../assets/scan_not_ok.mp3'
import BarcodeScanner from "../components/util/BarcodeScanner.vue";
import ItemDetails from "./orderdetails/ItemDetails.vue";


const system = useSystemStore()
const route = useRoute()
const router = useRouter()
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


const loadOrder = () => api().post(
    `/warehouse/order/item?expand=items.dimensions,items.images,marketplace`,
    {order_id_eas: route.params.id}
).then(data => order.value = data)
watch(() => route.params.id, () => {
  loadOrder()
})
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
  return api().post(`/warehouse/order/set-attribute`, {order_id_eas: order.value.order_id_eas, attribute: attribute, value: value}).then((data) => {
    Object.assign(order.value, data)
  })
}

const collect = () => setAttribute('status_id', 1).then(scanAll)
const pack = () => setAttribute('status_id', 2)
const unCollect = () => {
  if (confirm('Уверены???')){
    setAttribute('status_id', 0)
  }
}
const unPack = () => {
  if (confirm('Уверены???')){
    setAttribute('status_id', 1)
  }
}

const setScan = () => api().post(`/warehouse/order/set-scan`, {order_id_eas: order.value.order_id_eas, barcodes: barcodes}).then((items) => {
  for (let orderItem of order.value.items) {
   for (let item of items) {
     if (orderItem.product_id === item.product_id){
       Object.assign(orderItem, item)
     }
   }


  }
})

let scanTimeout = null

const scan = (barcode) => {
  if (!order.value.status_id) {
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
  if (!order.value.status_id && canEdit && confirm('Уверены???')){
    for (let item of Object.entries(barcodes)) {
      if (product_id === item[1].product_id){
        barcodes[item[0]].scanned = 0
      }
    }
    setScan()
  }
}

const scanAll = () => {
    for (let item of Object.entries(barcodes)) {
        barcodes[item[0]].scanned = barcodes[item[0]].quantity
    }
    setScan()
}
loadOrder()

const openNext = () => {
  api().post(
      `/warehouse/order/next`
  ).then((order) => router.replace(`/order-collect/${order.order_id_eas}`))
}

</script>

<template>
  <div class="order-collect">

    <XPanel v-if="order" >
      <div class="collect-top">
        <div class="left">
          <div class="item"><div class="title">№ заказа</div>
            <div class="value">{{ order.order_id_eas }}</div></div>
          <div class="item"><div class="title">№ док-та</div>
            <div class="value">{{ Number(order.doc_number_eas) }}</div></div>
          <div class="item" v-if="order.order_number_mp"><div class="title">№ на МП:</div>
            <div class="value">{{ order.order_number_mp }}</div></div>
          <div class="item" v-if="order.barcode_mp && order.marketplace">
            <div class="title">Штриход заказа для МП:</div>
            <div class="value" v-if="order.marketplace.type === 'wb'">{{ order.barcode_mp.replace(/(.{4})$/, ' $1') }}</div>
            <div class="value" v-else>{{ order.barcode_mp }}</div>
          </div>
          <div class="item" v-if="order.marketplace"><div class="title">МП:</div>
            <div class="value">{{ order.marketplace.title.slice(0, 30) }}</div></div>
          <div class="item flex"><div class="title">Создан:</div>
            <div class="value">{{ order.created_at }}</div></div>
          <div class="item flex"><div class="title">Собирает:</div>
            <div class="value">{{ order.wh_username }}</div></div>
          <div class="item flex" v-if="order.collected_at"><div class="title">Собран:</div>
            <div class="value">{{ order.collected_at }}</div></div>

        </div>
        <div class="right">
          <BtnStd v-if="canEdit && !order.status_id" @click="scanMode = !scanMode" :class="{active: scanMode}">
            <IconBarcode :height="40"/>
          </BtnStd>
          <div class="summary">Осталось: <div class="count" :class="{success: !remainTotal}">{{ remainTotal }}</div>    </div>
        </div>
      </div>
    </XPanel>
    <BarcodeScanner @decode="scan" v-if="scanMode"/>
    <div class="items">
      <ItemDetails
          v-if="order" v-for="item in order.items"
          :item="item"
          :key="`${item.order_id_eas}-${item.product_id}`"
          :full-images="order.items.length === 1"
          :scanned="barcodes[item.barcode].scanned"
          @scan="(code) => scan(code)"
          @reset="(product_id) => reset(product_id)"
          :status_id="order.status_id"
      />

    </div>

    <div class="actions" v-if="canEdit">
      <BtnStd @click="collect"  v-if="!order.status_id"><IconCheck color="#ffffff"/> Заказ собран</BtnStd>
      <BtnStd  class="warning" @click="unCollect" v-if="order.status_id === 1"><IconXmark color="#ffffff"/> Разобрать заказ</BtnStd>
      <BtnStd class="success" @click="pack" v-if="order.status_id === 1"><IconCheck color="#ffffff"/> Упаковать заказ</BtnStd>
      <BtnStd class="warning" @click="unPack" v-if="order.status_id === 2"><IconXmark color="#ffffff"/> Распаковать заказ</BtnStd>
    </div>

    <div class="next-order-panel" v-if="order && canEdit && order.status_id"  @click="openNext">
      <IconCheck color="#ffffff"/> Открыть следующий
    </div>

  </div>
</template>

<style  lang="scss">
@import './../scss/variables.scss';
@import './../scss/mixins.scss';

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
        &:not(.flex) .value{
            font-size: 120%;
            font-weight: bold;
        }
        &.flex{
          gap: 5px;
          align-items: center;
          .value{

            font-size: 80%;
          }
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

  }
  .actions{
    margin: 30px 0 80px 0;
    display: flex;
    justify-content: space-around;

  }

  .next-order-panel{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: $primary-color;
    color: #ffffff;
    padding: 10px 0;
    text-align: center;
  }
}
</style>