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

    editMode.value = true
}

</script>

<template>
  <div class="marketplace-review-answer" >
    <div class="header">
      <div class="left">
        <span class="author">{{ answer.author }}</span> <span class="date">{{ answer.created_at }}</span>
      </div>

    </div>
    <MarketplaceAnswerForm v-if="editMode" class="answer-form" :answer="answer" :review_uuid="answer.review_uuid" @sent="sent" @cancel="editMode = false"/>
    <div class="answer-text" v-else @click="setEditMode" @mouseleave="showEdit = false" @mouseenter="showEdit = true">
      {{ answer.text }}
      <span class="icon-edit" v-if="showEdit"><IconEdit/></span>
    </div>
  </div>
</template>

<style lang="scss">
@import './../../scss/main.scss';

.marketplace-review-answer{
  border-left: 2px solid $border-color;
  margin: 10px 0;
  padding-left:30px;
  .header{
    .author{
      font-weight: bold;
    }
    .date{
      color: lighten($color, 30%);
      font-size: 90%;
    }
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