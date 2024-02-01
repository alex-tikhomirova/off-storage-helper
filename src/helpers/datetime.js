const dateSql = (str, addZulu = false) => {
    if (addZulu){
        str+='Z'
    }
    const date = str?new Date(str):new Date()
    return [
        date.getFullYear(),
        String(date.getMonth()+1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join('-')
}

const timeSql = (str, addZulu = false) => {
    if (addZulu){
        str+='Z'
    }
    const date = str?new Date(str):new Date()
    return date.getHours() + ':' + String(date.getMinutes()).padStart(2, "0") + ':' + String(date.getSeconds()).padStart(2, "0");
}

const dateRu =  (str) => {
    const date = dateObj(str)
    return [
        String(date.getDate()).padStart(2, "0"),
        String(date.getMonth()+1).padStart(2, "0"),
        date.getFullYear(),
    ].join('.')
}
const shortDateTime = (str) => {
    const date = dateObj(str)
    return String(date.getDate()).padStart(2, "0") +'.'+String(date.getMonth()+1).padStart(2, "0")+' '+
        date.getHours() +':'+String(date.getMinutes()).padStart(2, "0")

}

const dateObj = (str, addZulu = false) => {
    if (addZulu){
        str+='Z'
    }
    return str?new Date(str):new Date()
}

const dateTimeSql = (str, addZulu = false) => {
    if (addZulu){
        str+='Z'
    }
    return dateSql(str) + ' ' + timeSql(str);
}

export {shortDateTime, dateRu, dateSql, dateTimeSql, timeSql}