import {reactive, watch} from "vue";

export default (data, callback) => {

    const parseUri = () => {
        const query = {
            filter: Object.assign({}, data),
        }
        const url = new URL(location.href)
        query.page = Number(url.searchParams.get('page')) || 1
        query.limit = Number(url.searchParams.get('limit'))
        query.order = url.searchParams.get('order')
        const filterString = new URL(location.href).searchParams.get('filter')
        if (filterString) {
            for (const data of filterString.split('||') || []){
                const attribute = data.split('::')
                if (attribute[1]){
                    if (typeof query.filter[attribute[0]] === 'object'){
                        query.filter[attribute[0]] = attribute[1].split(',')
                    }else{
                        query.filter[attribute[0]] = attribute[1]
                    }
                }
            }
        }
        return query
    }

    const query = reactive(parseUri())

    const worker =  {
        /*        fields: fields,*/
        items: [],
        checked: [],
        query: query,
        timeOut: null,
        debounce(fn) {
            if (this.timeOut) {
                clearTimeout(this.timeOut)
            }
            this.timeOut = setTimeout(() =>
                    fn.apply(null, [this.query]),
                500)
        },
        init() {
            watch(query.filter, (value) => this.filterChange(value))
            watch(() => query.limit, (value) => this.setQueryParam('limit', value))
            watch(() => query.order, (value) => this.setQueryParam('order', value))
            watch(() => query.page, (value) => this.setQueryParam('page', value))
            callback.apply(null, [this.query])
        },
        filterChange(value) {
            const query =  Object.entries(value).filter(value => !!value[1].length).map((value) => {
                return [value[0], value[1]].join(':')
            }).join('||')
            this.query.page = 1
            this.setQueryParam('filter', query)
        },
        setQueryParam(parameter, value){
            const url =  new URL(location.href)
            if (value){
                url.searchParams.set(parameter, value)
            }else{
                url.searchParams.delete(parameter)
            }
            history.pushState(null, null, url)
            this.debounce(callback)
        },
    }

    worker.init()
    return worker

}