import axios from "axios";
import {useSystemStore} from "./stores/system";

const dateTimeSql = (str) => {
    const date = str?new Date(str):new Date()
    return dateSql(str) + ' ' + date.getHours() + ':' + String(date.getMinutes()).padStart(2, "0");
}

const dateSql = (str) => {
    const date = str?new Date(str):new Date()
    return [
        date.getFullYear(),
            String(date.getMonth()+1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join('-')
}

const dateLocal = (str) => {
    const date = str?new Date(str):new Date()
    const options = {day: 'numeric', month: 'long', year: 'numeric' };
    return (new Intl.DateTimeFormat('ru-RU', options)).format(date)
}

const getParam =  (param, defval) => {
    if (window.publicParams && window.publicParams[param]){
        return window.publicParams[param];
    }
    return defval;
};

const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el){
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
}


const api = (catchErrors = true) => {
    const system = useSystemStore()


  //  const options = {headers: {'X-Csrf-Token': system.csrf, 'X-Requested-With': 'XMLHttpRequest'}, baseURL: 'http://offgroup.xyz/publicapi'}
    const options = {baseURL: 'http://offgroup.xyz/publicapi', withCredentials: true, xsrfCookieName: '_csrf'}
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


export {dateSql, dateTimeSql, dateLocal, getParam, api, scrollTo}
