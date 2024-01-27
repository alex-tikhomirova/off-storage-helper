<script setup>

import BtnStd from "../components/ui/BtnStd.vue";
import {ref} from "vue";
import IconFileImage from "../components/icons/IconFileImage.vue";
import IconCheck from "../components/icons/IconCheck.vue";
const scanMode = ref(false)
</script>

<template>
  <div class="order-collect">
    <div class="collect-top">
      <div class="summary">Всего товаров в заказе: <strong>3</strong>    </div>
      <BtnStd @click="scanMode = !scanMode">{{scanMode?'Завершить сканирование':'Сканировать ШК'}}</BtnStd>
    </div>


    <div class="items">
      <div class="item">
        <div class="title">
          Глобус Земли Classic физико-политический с подсветкой рельефный, d=32 см Ке013200233
          <div class="image"></div>
        </div>
        <div class="info">
          <div class="block"><label>Код</label><div class="value">71223</div> </div>
          <div class="block"><label>Место</label><div class="value">44A</div> </div>
          <div class="block"><label>Кол-во</label><div class="value">1</div> </div>
          <div class="block image"><BtnStd class=""><IconFileImage :height="16" /></BtnStd> </div>
        </div>


      </div>
      <div class="item">
        <div class="title">
          Атлас для детей "Мир вокруг тебя"
          <div class="image"></div>
        </div>
        <div class="info">
          <div class="block"><label>Код</label><div class="value">118434</div> </div>
          <div class="block"><label>Место</label><div class="value">43A</div> </div>
          <div class="block"><label>Кол-во</label><div class="value">2</div> </div>
          <div class="block image"><BtnStd class=""><IconFileImage :height="16" /></BtnStd> </div>
        </div>


      </div>
    </div>


    <div class="actions">
      <BtnStd class="" disabled><IconCheck color="#ffffff"/> Заказ собран</BtnStd>
    </div>

  </div>
</template>

<style scoped lang="scss">
.order-collect{
  $border-color: #cccccc;
  .collect-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .summary{
      strong{
        color: #bd0000;
      }
    }
  }
  .items{
    margin: 10px 0;
    .item{
      margin: 10px 0;
      border: 1px solid $border-color;

      &:not(:first-child){
       /* border-top: 1px solid $border-color;*/
      }
      .info{
        display: flex;
        width: 100%;
        justify-content: space-between;


        .block{
          &:not(:last-child){
            border-right: 1px solid $border-color;
          }
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
      }
      .title{
        border-bottom: 1px solid $border-color;
        display: flex;
        padding: 7px 5px 5px 5px;
        font-size: 12px;
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