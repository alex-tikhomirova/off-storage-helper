<script setup>

import InputSelectable from "../ui/InputSelectable.vue";
import {computed, ref} from "vue";
import {api} from "../../helper.js";
import IconTelegram from "../icons/IconTelegram.vue";
import IconXmark from "../icons/IconXmark.vue";
import BtnStd from "../ui/BtnStd.vue";
import ModalWindow from "./ModalWindow.vue";

const props = defineProps({
  type: String
})
const emit = defineEmits(['select'])

const options = ref([])
const template = ref(null)
const editMode = ref(false)

const loadOptions = () => api().get(`conversation/answer-template/list?type=${props.type}`).then(data => options.value = data)
loadOptions()
const addNew = () => {
  template.value = {
    id: '',
    title: '',
    text: '',
    type: props.type,
  }
  editMode.value = true
}
const save = () => {
  const data = {
    id: template.value.id,
    title: template.value.title,
    text: template.value.text,
    type: template.value.type,
  }
  api().post(`conversation/answer-template/save`, data).then((data) => {
    template.value = data
    editMode.value = false
    emit('select', template.value.text)
    loadOptions()
  })
}

const remove = () => {
  api().post(`conversation/answer-template/remove`, {id: template.value.id}).then(() => {
    template.value = null
    loadOptions()
  })
}
const quickAnswers = computed(() => options.value.slice(0, 5))
</script>

<template>
  <div class="anwer-template">
    <div class="quick-templates">
      <span class="answer" v-for="answer in quickAnswers"><span class="link" @click="$emit('select', answer.text)">{{answer.title}}</span> </span>
    </div>
    <InputSelectable v-if="!editMode" :options="options" v-model="template" option-text="title" :visible-options="999"
                     @update:model-value="() => $emit('select', template.text)"/>

    <div class="controls-btns" v-if="!editMode">
      <span class="link" @click="addNew">Добавить шаблон</span>
      <template v-if="template"> | <span class="link"  @click="editMode = !editMode">Изменить шаблон</span></template>
      <template v-if="template"> | <span class="link" @click="remove">Удалить шаблон</span></template>
    </div>

    <ModalWindow title="Редактирование шаблона" v-if="editMode && template" @close="editMode = false">
    <div class="form">
      <div>Редактирование шаблона</div>
      <div class="form-group">
        <input class="input" v-model="template.title" placeholder="Наименование шаблона"/>
      </div>
      <div class="form-group">
        <textarea class="input" v-model="template.text" placeholder="Текст шаблона"></textarea>
      </div>

      <div class="form-footer">
        <BtnStd class="default" @click="editMode = false" ><IconXmark/> Закрыть</BtnStd>
        <BtnStd type="button" class="success" @click="save">
          <IconTelegram/>
          Сохранить шаблон
        </BtnStd>
      </div>


    </div>
    </ModalWindow>
  </div>
</template>

<style  lang="scss">
.anwer-template{
  margin: 20px 0 20px 0;
  .quick-templates{
    margin: 5px 0;
    font-size: 90%;
    >span{
      margin-right: 5px;
      &:not(:last-child){
        &:after{
          display: inline;
          content: '|';
          margin-left: 5px;
        }

      }

    }
  }
  .controls-btns{
    margin: 5px 0;
    font-size: 90%;
  }
  .form{
    margin-bottom: 50px
  }
}
</style>