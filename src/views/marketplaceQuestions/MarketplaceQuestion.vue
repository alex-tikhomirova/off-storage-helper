<script setup>

import {ref} from "vue";
import IconCircleArrow from "../../components/icons/IconCircleArrow.vue";
import MarketplaceQuestionAnwer from "./MarketplaceQuestionAnwer.vue";
import MarketplaceAnswerForm from "./MarketplaceAnswerForm.vue";
import BtnStd from "../../components/ui/BtnStd.vue";
import XPanel from "../../components/ui/XPanel.vue";
import IconXmark from "../../components/icons/IconXmark.vue";
import {api} from "../../helper.js";

const props = defineProps({
  question: Object,
})

const emit = defineEmits(['updated'])
const formVisible = ref(false)
const rejecting = ref(false)
const answerSent = () => {
  formVisible.value = false
  emit('updated')
}
const reject = () => {
  if (confirm('Уверены, что хотите отклонить вопрос??')) {
    rejecting.value = true
    api().post('/conversation/question/reject-question', {uuid: props.question.uuid}).then(() => {
      rejecting.value = false
      emit('updated')
    }).catch(() => rejecting.value = false)
  }
}
</script>

<template>
  <XPanel>
  <div class="question" >
    <div class="header">
      <div class="left">
        <div class="title">{{ question.product_name }}</div>
        <div class="info">
          <div>Код товара: <router-link :to="`/product/${question.product_id}`" class="value"><strong>{{ question.product_id }}</strong></router-link></div>
          <div v-if="question.product">Код на МП: <a :href="question.product.link" target="_blank"><strong>{{ question.product.shopSku }}</strong></a></div>
          <div>Маркетплейс: <strong>{{ question.marketplace.title }}</strong></div>
          <div class="date">{{ question.created_at }}</div>
        </div>
      </div>
      <div>
        <BtnStd v-if="question.status_id === 0" @click="reject" class="default" :disabled="rejecting"><IconXmark /></BtnStd>

      </div>
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
  </XPanel>
</template>

<style scoped lang="scss">
@import './../../scss/main.scss';

.question {

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
    justify-content: flex-start;
  }

  .answers {
    margin: 20px 0 0 30px;

  }
}

</style>