<script setup>
import IconTelegram from "../../components/icons/IconTelegram.vue";
import {ref} from "vue";
import {api} from "../../helper.js";
import IconXmark from "../../components/icons/IconXmark.vue";
import BtnStd from "../../components/ui/BtnStd.vue";
import AnwerTemplate from "../../components/util/AnwerTemplate.vue";

const props = defineProps({
  review_uuid: String,
  answer: Object,
})
const emit = defineEmits(['sent', 'cancel']);

/*const greetings = ['Добрый день!', 'Здравствуйте!']
const greetingkey = Math.floor(Math.random() * greetings.length)
const answerText = ref(props.answer?props.answer.text:greetings[greetingkey])*/
const answerText = ref(props.answer?props.answer.text:'')
const sending = ref(false)
const submitAnswer = () => {
  if (answerText.value){
    sending.value = true
    const data = {text: answerText.value, uuid: props.review_uuid}
    if (props.answer){
      data.rid = props.answer.rid
    }
    api().post('/conversation/review/post-answer', data).then(() => {
      sending.value = false
      emit('sent')
    }).catch(() => sending.value = false)
  }


}
</script>

<template>
  <div class="marketplace-answer-form">
    <AnwerTemplate type="review" @select="(value) => answerText = value"/>
    <div class="form">
      <div class="form-group">
        <textarea class="input" v-model="answerText" placeholder="Введите ваш ответ" ></textarea>
      </div>
      <div class="form-footer">
        <BtnStd type="button" @click="submitAnswer" :disabled="sending"><IconTelegram/>
          {{ sending?'Отправка...':'Отправить' }}</BtnStd>
        <BtnStd class="default" @click="$emit('cancel')" :disabled="sending"><IconXmark/> Отмена</BtnStd>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>