<script setup>

import {ref} from "vue";
import IconCircleArrow from "../../components/icons/IconCircleArrow.vue";
import MarketplaceQuestionAnwer from "./MarketplaceQuestionAnwer.vue";
import MarketplaceAnswerForm from "./MarketplaceAnswerForm.vue";
import BtnStd from "../../components/ui/BtnStd.vue";

defineProps({
  question: Object,
})

const emit = defineEmits(['updated'])
const formVisible = ref(false)
const answerSent = () => {
  formVisible.value = false
  emit('updated')
}
</script>

<template>
  <div class="question" >
    <div class="header">
      <div class="left">
        <div class="title">{{ question.product_name }}</div>
        <div class="info">
          <div>Код товара: <strong>{{ question.product_id }}</strong></div>
          <div>Маркетплейс: <strong>{{ question.marketplace.title }}</strong></div>
        </div>
      </div>
      <div class="date">{{ question.created_at }}</div>
    </div>
    <div class="text">
      {{ question.text }}
    </div>
    <div class="footer">
      <span class="text-muted">{{ question.author }}</span>
      <BtnStd v-if="question.is_answerable && !question.answers.length" @click="formVisible = !formVisible"><IconCircleArrow :rotate="formVisible?180:0"/> Ответить</BtnStd>
    </div>
    <MarketplaceAnswerForm v-if="formVisible" :question_uuid="question.uuid" @sent="answerSent" @cancel="formVisible = false"/>
    <div class="answers">
      <MarketplaceQuestionAnwer v-for="answer in question.answers" :answer="answer" :key="answer.rid" @updated="$emit('updated')"/>
    </div>

  </div>
</template>

<style scoped lang="scss">
@import './../../scss/main.scss';

.question {
  margin-bottom: 50px;
  .header{
    display: flex;
    justify-content: space-between;

    .left{

    }
    .title{
      font-weight: bold;
    }
    .info{
      margin: 10px 0;
      display: flex;
      gap: 15px;
    }
  }

  .text{
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0;
  }
  .footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .answers {
    margin: 20px 0 0 30px;

  }
}

</style>