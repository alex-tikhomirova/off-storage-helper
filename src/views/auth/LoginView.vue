<script setup>
import {api} from "../../helper.js";
import InputSelectable from "../../components/ui/InputSelectable.vue";
import {ref} from "vue";
import BtnStd from "../../components/ui/BtnStd.vue";
import {useRoute, useRouter} from "vue-router";
import {useSystemStore} from "../../stores/system.js";
import XPanel from "../../components/ui/XPanel.vue";


const router = useRouter()
const route = useRoute()
const system = useSystemStore()

const options = ref([])
const username = ref(null)
const password = ref(null)

const login = () => api().post('/user/login', {username: username.value.username, password: password.value}).then(() => {
  system.loadUser().then(() => {
    router.replace(route.query.return || '/')
  })

})

const loadOptions = () => api().get('/user/list').then(data => options.value = data)

</script>

<template>

  <div class="login-view">

      <div class="wrapper">
        <XPanel title="Вход в систему">
        <div class="login-box">
          <div class="form">
            <div class="form-group">
              <label>Имя пользователя</label>
              <InputSelectable :options="options" @focus="() => loadOptions()"  option-text="username" v-model="username" :visible-options="999"  />
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <div><input type="password" class="input" v-model="password"/> </div>
            </div>
            <div class="form-footer">
              <BtnStd @click="login">Войти</BtnStd>
            </div>
          </div>
        </div>
        </XPanel>
      </div>


  </div>

</template>

<style scoped>
/*@import "./../../scss/variables.scss";*/
.login-view{
  padding: 10px;

  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  .login-box{
    min-width: 300px;
  }
}
</style>