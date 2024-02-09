<script setup>
import { Fancybox, Carousel } from "@fancyapps/ui";
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@fancyapps/ui/dist/carousel/carousel.css';
import {onMounted, onUnmounted, onUpdated, ref} from "vue";

const container = ref(null)

const options = {
  Carousel: {
    infinite: true,
    Dots: false
  }
}

defineProps({
  images: Array
})

let car = null


onMounted(() => {
  car = new Carousel(container.value, {Dots: false, Navigation: false })
  Fancybox.bind(container.value, '[data-fancybox]', options)

})
onUpdated(() => {
  Fancybox.unbind(container.value);
  Fancybox.close();
  car.reInit({Dots: false, Navigation: false })
 // car = new Carousel(container.value, {Dots: false, Navigation: false })
  Fancybox.bind(container.value, '[data-fancybox]', options)
})
onUnmounted(() => {
  Fancybox.destroy();
  car = null
})

</script>

<template>
  <div ref="container">
    <a data-fancybox="gallery" :href="image.full" v-for="image in images" :key="image.thumb" class="f-carousel__slide">
      <img :src="image.thumb" alt="" />
    </a>
  </div>
</template>

<style scoped lang="scss">

</style>