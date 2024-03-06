import {defineStore} from 'pinia';
import {api} from "../helper.js";



export const useSystemStore = defineStore('system', {
    state: () => Object.assign({messages: [], user: null, title: null}),
    actions: {
        addMessage (text, type = 'info') {
            this.$state.messages.push(
                {
                    type: type,
                    message: text
                }
            )
        },
        addError(text){
            this.addMessage(text, 'error')
        },
        addWarning(text){
            this.addMessage(text, 'warning')
        },
        clear(type){
            if (type) {
                this.$state.messages = this.$state.messages.filter((msg) => msg.type !== type)
            }else{
                this.$state.messages = []
            }
        },
        removeMessage(idx){
            this.$state.messages = this.$state.messages.filter((e, i) => i !== idx)
        },
        catchAxiosError (reason) {
            let message = 'Произошла ошибка. Повторите попытку';
            if (reason.response && reason.response.data && reason.response.data.message){
                message = reason.response.data.message
            }else{
                if (reason.message){
                    message = reason.message
                }
            }
            this.addError(message)
            return reason
        },
        systemMessages (response) {
            if (response.data && response.data.messages){
                for (const type in response.data.messages){
                    for (const text of response.data.messages[type]){
                        this.addMessage(text, type)
                    }
                }
            }
        },
        loadUser(){
            return api().get('/user/current?expand=authItems').then((user) => {
                this.$state.user = user
            })
        },
    },
    getters: {
        can: (state) => {
            return (rule) => state.user && state.user.authItems.filter((item) => item.name === rule).length
        }
    }
})
