<script setup>
import {dateRu} from "../../helpers/datetime.js";
import XPanel from "../../components/ui/XPanel.vue";
import ProductImagesSlider from "../../components/ProductImagesSlider.vue";
import IconXmark from "../../components/icons/IconXmark.vue";
import FlexTbl from "../../components/ui/FlexTbl.vue";
import FlexTblVblock from "../../components/ui/FlexTblVblock.vue";
import {computed} from "vue";

/**
 *
 * @param {{item:{
 * product_id: string,
 * product_name: string,
 * vendor_code: string,
 * marketplace_sku: string,
 * current_stock: int,
 * store_place: string,
 * quantity: int,
 * scanned: int,
 * order_eas_id: string,
 * barcode: string,
 * date_last_ship: string,
 * images: array,
 * }}} props description
 *
 */

const props = defineProps({
  item: Object,
  fullImages: {
    type: Boolean,
    default: false,
  },
  status_id: Number,
  scanned: {
    type: Number,
    default: 0
  }
})

defineEmits(['reset', 'scan'])

//const multiItems = computed(() => props.item.quantity>1)
const multiItems = computed(() => true)
const succeedScanned = computed(() => props.scanned === props.item.quantity)

</script>

<template>
  <XPanel class="details-item"  :title="item.product_name">
    <div class="main">
      <div class="info">

        <FlexTbl>
          <FlexTblVblock label="Код">
            <router-link :to="`/product/${item.product_id}`" class="value">{{ item.product_id }}</router-link>
          </FlexTblVblock>
          <FlexTblVblock label="Код поставщика">
            {{ item.vendor_code }}
          </FlexTblVblock>
          <FlexTblVblock label="Код МП">
            {{ item.marketplace_sku }}
          </FlexTblVblock>
        </FlexTbl>
        <FlexTbl>
          <FlexTblVblock label="Место, остаток">
            {{ item.store_place.trim().replace(/,$/, '') }}, {{ item.current_stock }}шт
          </FlexTblVblock>
          <FlexTblVblock label="Посл. пост" v-if="item.date_last_ship && item.date_last_ship !== '0000-00-00 00:00:00'">
            {{ dateRu(item.date_last_ship) }}
          </FlexTblVblock>
        </FlexTbl>
        <FlexTbl>
          <FlexTblVblock label="Штрихкод" class="barcode" @click="$emit('scan', item.barcode)">{{ item.barcode }}</FlexTblVblock>
          <FlexTblVblock label="Кол-во" class="qty" :class="{primary: multiItems, success: succeedScanned}">{{ item.quantity }}</FlexTblVblock>
          <FlexTblVblock label="Считано" class="scan" :class="{success: succeedScanned}" @click="$emit('reset', item.product_id)">
            {{ Number(item.scanned) }}
            <div class="reset" v-if="!status_id"><IconXmark/></div>
          </FlexTblVblock>
        </FlexTbl>

      </div>
      <div class="image" v-if="!fullImages">
        <ProductImagesSlider v-if="item.images" :images="item.images" :key="item.order_eas_id"/>
        <img v-else src="/noimage.gif" alt="" class="noimage">
      </div>
    </div>
    <ProductImagesSlider v-if="fullImages" :images="item.images" :key="item.order_eas_id" thumb-size="full"/>
  </XPanel>
</template>

<style  lang="scss">

@import './../../scss/variables.scss';
@import './../../scss/mixins.scss';

.details-item{
  margin: 10px 0;
  border: 1px solid $border-color;
  .xpanel-title{
    font-size: 90%;
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


    .flex-tbl-vblock.barcode{
      flex: 2;
    }



    .flex-tbl-vblock.qty.primary
    {
      .value{
        font-size: 20px;
        text-decoration: underline;
      }
    }

    .flex-tbl-vblock.scan {
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
      &.success .value{
        background: $color-success;
        border-color: darken($color-success, 10%);
      }
    }


    .image{
      width: 150px;
      padding: 5px;
      .noimage{
        max-width: 100%;
        height: auto;
      }
    }
  }

}
</style>