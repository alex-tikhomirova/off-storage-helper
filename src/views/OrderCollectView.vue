<script setup>
import {ref} from "vue";
import {api} from "../helper.js";
import IconCheck from "../components/icons/IconCheck.vue";
import router from "../router/index.js";

const list = ref([])


api().post('/warehouse/order/list', {}).then(response => list.value = response)

</script>

<template>
  <div class="order-collect-view">
    <div class="order-list">
      <div class="item flex" v-for="item in list">
        <div class="info">
          <div class="flex">
            <div class="order-number link" @click="router.push(`/order-collect/${item.order_id_eas}`)">{{item.order_id_eas}}</div>
            <div class="numbers">
              <div>
                <div class="title">№ документа</div>
                <div>{{item.order_id_eas}}</div>
              </div>
            </div>
          </div>
          <div class="user ">
            <div class="title">Собирает:</div>
            <div class="value">{{item.wh_username}}</div>
          </div>
          <div class="user ">
            <div class="title">Собрал:</div>
            <div class="value">{{item.wh_username}}</div>
          </div>
        </div>
        <div class="status">
          <div class="icon">
            <IconCheck/>
          </div>

        </div>

      </div>
    </div>

  </div>

</template>

<style scoped lang="scss">
@import './../scss/variables.scss';
.order-collect-view{
  .order-list{
    .item{
      border-bottom: 1px solid #ccc;
      display: flex;
      .info{
        flex: 1 1 80%;
        .order-number{
          flex: 1;
          font-size: 20px;
          font-weight: bold;
        }
        .numbers{
          flex: 1;
          .title{
            color: lighten($color, 20%);
            font-size: 90%;
          }
        }
      }
      .status{
        width: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .icon{
          text-align: center;
          svg{
            fill: $color-success;
            height: 24px;
          }
        }
      }

      .user{
        border-top: 1px solid #ccc;
        padding: 2px;
        align-items: center;
        display: flex;
        gap: 5px;
        word-break: break-all;
        .title{
          color: lighten($color, 20%);
          font-size: 90%;
        }
      }
    }
  }
}
</style>