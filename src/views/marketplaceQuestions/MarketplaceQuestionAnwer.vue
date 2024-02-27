<script setup>
import {ref} from "vue";
import IconEdit from "../../components/icons/IconEdit.vue";
import MarketplaceAnswerForm from "./MarketplaceAnswerForm.vue";

const props = defineProps({
  answer: Object,
})
const emit = defineEmits(['updated'])
const editMode = ref(false)
const showEdit = ref(false)
const sent = () => {
  editMode.value = false
  emit('updated')
}
const setEditMode = () => {
  if (props.answer.editable){
    editMode.value = true
  }
}

</script>

<template>
  <div class="marketplace-question-answer" >
    <div class="header">
      <div class="left">
        <div class="author">{{ answer.author }}:</div>
      </div>
      <div class="date">
        {{ answer.created_at }}
      </div>
    </div>
    <MarketplaceAnswerForm v-if="editMode" class="answer-form" :answer="answer" :question_uuid="answer.question_uuid" @sent="sent" @cancel="editMode = false"/>
    <div class="answer-text" v-else @click="setEditMode" @mouseleave="showEdit = false" @mouseenter="showEdit = true">
      {{ answer.text }}
      <span class="icon-edit" v-if="answer.editable && showEdit"><IconEdit/></span>
    </div>
  </div>
</template>

<style lang="scss">
@import './../../scss/main.scss';

.marketplace-question-answer{
  border-left: 2px solid $border-color;
  margin: 10px 0;
  padding-left:30px;
  .author{
    font-weight: bold;
  }
  .answer-form{
    margin: 10px 0;
  }
  .answer-text{
    margin: 10px 0;
    position: relative;
    .icon-edit{

    }
  }
}
</style>