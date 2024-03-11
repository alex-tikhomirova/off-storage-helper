<script setup>
import IconXmark from "../icons/IconXmark.vue";


defineProps({
  title: String
})
defineEmits(['close'])
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-window">
      <div class="modal-header" v-if="title">
        <div class="title">{{title}}</div>
        <div class="close" @click="$emit('close')"><IconXmark/></div>
      </div>

      <div class="modal-body">
        <slot/>
      </div>

    </div>
  </div>
</template>

<style lang="scss">
@import './../../scss/variables.scss';

.modal-backdrop{
  position: fixed;
  z-index: 9;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);

  .modal-window{
    background: #ffffff;
    border: 1px solid $border-color;
    max-width: 800px;
    margin: auto;

    .modal-header{
      display: flex;
      padding: 8px 15px;
      justify-content: space-between;
      background: rgba(35, 122, 151, 0.07);
      .title{

        font-weight: bold;

      }
      .close{
        cursor: pointer;
        svg{
          height: 16px;
        }
      }
    }
    .modal-body{

      padding: 15px;
    }
    .modal-footer{
      display: flex;
      justify-content: space-between;
      margin: 15px;
    }
  }
}
</style>