import axios from "axios";
import {useSystemStore} from "./stores/system";


const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el){
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
}


const api = (catchErrors = true) => {
    const system = useSystemStore()


  //  const options = {headers: {'X-Csrf-Token': system.csrf, 'X-Requested-With': 'XMLHttpRequest'}, baseURL: 'http://offgroup.xyz/publicapi'}
    const options = {baseURL: '/publicapi', withCredentials: true, xsrfCookieName: '_csrf'}
    const api = axios.create(options)

    const catcher = (e) => {
        if (catchErrors) {
            system.catchAxiosError(e)
        }
       // throw e.response.data
        throw e
    }

    return {
        get(resource){
            return api.get(resource).then(system.systemMessages, catcher)
        },
        post(resource, data){
            return api.post(resource, data).then(system.systemMessages, catcher)
        },
    }
}


export {api, scrollTo}
