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
import ProductImagesSlider from "../components/ProductImagesSlider.vue";
import {dateRu} from "../helpers/datetime.js";

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


const loadOrder = () => api().post(`/warehouse/order/item?expand=items.dimensions,items.images,marketplace`, {order_id_eas: route.params.id}).then(data => order.value = data)
watch(() => order.value, (value) => {
  console.log('change')
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

const scanAll = (product_id) => {
    for (let item of Object.entries(barcodes)) {
        barcodes[item[0]].scanned = barcodes[item[0]].quantity
    }
    setScan()
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
          <BtnStd v-if="canEdit && !order.status_id" @click="scanMode = !scanMode" :class="{active: scanMode}">
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
              <div class="vblock"><label>код МП</label><div class="value">{{ item.marketplace_sku }}</div> </div>
            </div>
            <div class="flex-tbl place">
              <div class="vblock"><label>Место</label><div class="value">{{ item.store_place }}</div> </div>
              <div class="vblock"><label>Остаток</label><div class="value">{{ item.current_stock }}</div> </div>
              <div class="vblock" v-if="item.date_last_ship && item.date_last_ship !== '0000-00-00 00:00:00'"><label>Посл. пост</label><div class="value">{{ dateRu(item.date_last_ship) }}</div> </div>
            </div>
            <div class="flex-tbl counters" :class="{multi: item.quantity>1, success: barcodes[item.barcode].scanned === item.quantity}">
              <div class="vblock barcode"><label>Штрихкод</label><div class="value" @click="() => scan(item.barcode)">{{ item.barcode }}</div> </div>
              <div class="vblock qty"><label>Кол-во</label><div class="value">{{ item.quantity }}</div> </div>
              <div class="vblock scan" @click="() => reset(item.product_id)"><label>Считано</label><div class="value" >{{ Number(item.scanned) }}</div> <div class="reset" v-if="!order.status_id"><IconXmark/></div></div>
            </div>
          </div>
          <div class="image">
            <ProductImagesSlider v-if="item.images" :images="item.images"/>
            <img v-else src="/noimage.gif" alt="">

          </div>

        </div>

      </XPanel>
    </div>


    <div class="actions" v-if="canEdit">
      <BtnStd @click="collect"  v-if="!order.status_id"><IconCheck color="#ffffff"/> Заказ собран</BtnStd>
      <BtnStd  class="warning" @click="unCollect" v-if="order.status_id === 1"><IconXmark color="#ffffff"/> Разобрать заказ</BtnStd>
      <BtnStd class="success" @click="pack" v-if="order.status_id === 1"><IconCheck color="#ffffff"/> Упаковать заказ</BtnStd>
      <BtnStd class="warning" @click="unPack" v-if="order.status_id === 2"><IconXmark color="#ffffff"/> Распаковать заказ</BtnStd>

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

        }
        .flex-tbl{
          display: flex;
          justify-content: center;

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


          &:not(:last-child) {
            border-bottom: 1px solid $border-color;
          }
          .vblock{
            text-align: center;

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
          width: 150px;
          padding: 5px;
        }
/*        .image{

          width: 160px;
          height: 160px;
          text-align: center;
          overflow: hidden;
          >img{
            max-width: 100%;
            max-height: 100%;
          }
          .image-slider{
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;

            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            .slide{
              scroll-snap-align: start;
              flex-shrink: 0;
              width: 150px;
              height: 160px;
              margin-right: 50px;
              transform-origin: center center;
              transform: scale(1);
              transition: transform 0.5s;
              position: relative;

              img{

              }
            }
          }
        }*/
      }

    }
  }
  .actions{
    margin: 30px 0;
    display: flex;
    justify-content: space-around;
  }
}
</style>