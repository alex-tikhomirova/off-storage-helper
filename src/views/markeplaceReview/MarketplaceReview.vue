<script setup>
import XPanel from "../../components/ui/XPanel.vue";
import IconStar from "../../components/icons/IconStar.vue";
import IconUser from "../../components/icons/IconUser.vue";
import ProductImagesSlider from "../../components/ProductImagesSlider.vue";
import BtnStd from "../../components/ui/BtnStd.vue";
import IconCircleArrow from "../../components/icons/IconCircleArrow.vue";
import {ref} from "vue";

import MarketplaceAnswerForm from "./MarketplaceAnswerForm.vue";
import MarketplaceReviewAnwer from "./MarketplaceReviewAnwer.vue";

defineProps({
  review: Object,
})
const emit = defineEmits(['updated'])

const formVisible = ref(false)
const answerSent = () => {
  formVisible.value = false
  emit('updated')
}
</script>

<template>
  <XPanel>
    <div class="review">
      <div class="header">
        <div class="left">
          <div class="title">{{ review.product_name }}</div>
          <div class="info">
            <div>Код товара: <router-link :to="`/product/${review.product_id}`" class="value"><strong>{{ review.product_id }}</strong></router-link></div>
            <div v-if="review.product">Код на МП: <a :href="review.product.link" target="_blank"><strong>{{ review.product.shopSku }}</strong></a></div>
            <div v-if="review.marketplace">Маркетплейс: <strong>{{ review.marketplace.title }}</strong></div>

          </div>
        </div>
      </div>
      <div class="author">
        <div class="data">
          <div class="ava">
            <IconUser :height="16"/>
          </div>
          <div>
            <strong>{{ review.author || 'Пользователь скрыл данные' }}</strong>
            <div class="date">{{ review.created_at }}</div>
          </div>
        </div>
        <div class="rating">
          <IconStar :height="16" color="#ffa900" :key="idx" v-for="idx in review.rating"/>
        </div>
      </div>
      <div class="text">

        {{ review.text }}
      </div>
      <ProductImagesSlider v-if="review.photos" :images="review.photos" :key="review.uuid" :slides="6"/>
      <div class="footer">
        <BtnStd v-if="!review.answers.length" @click="formVisible = !formVisible"><IconCircleArrow :rotate="formVisible?180:0"/> Ответить</BtnStd>
      </div>
      <MarketplaceAnswerForm v-if="formVisible" :review_uuid="review.uuid" @sent="answerSent" @cancel="formVisible = false"/>
      <div class="answers">
        <MarketplaceReviewAnwer v-for="answer in review.answers" :answer="answer" :key="answer.rid" @updated="$emit('updated')"/>
      </div>
    </div>
  </XPanel>
</template>

<style lang="scss">
@import './../../scss/main.scss';

.review {

  .header {
    display: flex;
    justify-content: space-between;

    .left {

    }

    .title {
      font-weight: bold;
    }

    .info {
      margin: 10px 0;
      display: flex;
      gap: 15px;
    }
  }
  .author{
    display: flex;
    gap: 15px;
    .data{
      display: flex;
      gap: 10px;
      align-items: center;
      .date{
        color: lighten($color, 30%);
        font-size: 90%;
      }
      .ava{
        height: 30px;
        width: 30px;
        background: $body-background;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .rating{
      display: flex;
    }
  }

  .text {
    margin: 20px 0;
  }
  .footer{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .answers {
    margin: 20px 0 0 30px;

  }
}
</style>