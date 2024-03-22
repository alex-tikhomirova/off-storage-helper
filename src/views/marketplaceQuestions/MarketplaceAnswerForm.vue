<script setup>
import IconTelegram from "../../components/icons/IconTelegram.vue";
import {ref} from "vue";
import {api} from "../../helper.js";
import IconXmark from "../../components/icons/IconXmark.vue";
import BtnStd from "../../components/ui/BtnStd.vue";
import AnwerTemplate from "../../components/util/AnwerTemplate.vue";

const props = defineProps({
  question_uuid: String,
  answer: Object,
})
const greetings = ['Добрый день!', 'Здравствуйте!']
const greetingkey = Math.floor(Math.random() * greetings.length)
const emit = defineEmits(['sent', 'cancel']);
const answerText = ref(props.answer?props.answer.text:greetings[greetingkey])
const sending = ref(false)
const submitAnswer = () => {
  if (answerText.value){
    sending.value = true
    const data = {text: answerText.value, uuid: props.question_uuid}
    if (props.answer){
      data.rid = props.answer.rid
    }
    api().post('/conversation/question/post-answer', data).then(() => {
      sending.value = false
      emit('sent')
    }).catch(() => sending.value = false)
  }


}
</script>

<template>
  <div class="marketplace-answer-form">
    <AnwerTemplate type="answer" @select="(value) => answerText = value"/>
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