<script setup>
import {api} from "../../helper.js";
import InputSelectable from "../../components/ui/InputSelectable.vue";
import {ref} from "vue";
import BtnStd from "../../components/ui/BtnStd.vue";
import {useRouter} from "vue-router";
import {useSystemStore} from "../../stores/system.js";


const router = useRouter()
const system = useSystemStore()

const options = ref([])
const username = ref(null)
const password = ref(null)

const login = () => api().post('/user/login', {username: username.value.wh_username, password: password.value}).then(() => {
  system.user = {username: username.value.wh_username}
  router.back()
})

const loadOptions = () => api().get('/user/list').then(data => options.value = data)

</script>

<template>

  <div class="login-view">
  <div class="login-box">
    <div class="title">Вход в систему</div>
    <div class="form">
      <div class="form-group">
        <label>Имя пользователя</label>
        <InputSelectable :options="options" @focus="() => loadOptions()"  option-text="wh_username" v-model="username" :visible-options="999"  />
      </div>
      <div class="form-group">
        <label>Имя пользователя</label>
        <div><input type="password" class="input" v-model="password"/> </div>
      </div>
      <div class="form-footer">
        <BtnStd @click="login">Войти</BtnStd>
      </div>
    </div>
  </div>
  </div>

</template>

<style scoped>
/*@import "./../../scss/variables.scss";*/
.login-view{
  padding: 10px;
  .login-box{
    padding: 20px;
    margin: 50% auto;
    width: 300px;
    border: 1px solid #ccc;
    .title{
      font-size: 120%;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
}
</style>