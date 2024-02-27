<script setup>
import {useSystemStore} from "../stores/system.js";
import {useRoute, useRouter} from "vue-router";
import XPanel from "../components/ui/XPanel.vue";
import {api} from "../helper.js";
import {ref, watch} from "vue";
import ProductImagesSlider from "../components/ProductImagesSlider.vue";
import FlexTbl from "../components/ui/FlexTbl.vue";
import FlexTblVblock from "../components/ui/FlexTblVblock.vue";

const system = useSystemStore()
const route = useRoute()
const router = useRouter()
system.title = `Информация о товаре : ${route.params.id}`

const product = ref(null)
const loadItem = () => api().post(
    `/warehouse/product/item?expand=dimensions,images`,
    {product_id: route.params.id}
).then(data => product.value = data)
watch(() => route.params.id, () => {
  loadItem()
})
loadItem()
</script>

<template>

  <XPanel v-if="product" :title="product.product_name">
    <FlexTbl>
      <FlexTblVblock label="">Скоро здесь появится больше информации о товаре</FlexTblVblock>
    </FlexTbl>
    <FlexTbl>
      <FlexTblVblock label="Длина">{{ product.dimensions.length }} cm</FlexTblVblock>
      <FlexTblVblock label="Ширина">{{ product.dimensions.width }} cm</FlexTblVblock>
      <FlexTblVblock label="Высота">{{ product.dimensions.height }} cm</FlexTblVblock>
    </FlexTbl>

    <ProductImagesSlider :images="product.images" :key="product.product_id" thumb-size="full"/>
  </XPanel>
</template>

<style scoped lang="scss">

</style>