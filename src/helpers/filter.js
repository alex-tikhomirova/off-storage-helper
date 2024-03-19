import {reactive, watch} from "vue";
import {useRouter} from "vue-router";

export default (data, callback) => {

    const router = useRouter()
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
            watch(query.filter, () => this.filterChange())
            watch(() => query.limit, () => this.setQueryParam())
            watch(() => query.order, () => this.setQueryParam(true))
            watch(() => query.page, () => this.setQueryParam(true))
            callback.apply(null, [this.query])
        },
        filterChange() {
            this.query.page = 1
            this.setQueryParam()
        },
        setQueryParam(scrollTop = false){


            const query = {filter: Object.entries(this.query.filter).filter(value => !!value[1].length).map((value) => {
                    return [value[0], value[1]].join('::')
                }).join('||')}


            if (this.query.limit){
                query.limit = this.query.limit
            }
            if (this.query.order){
                query.order = this.query.order
            }
            if (this.query.page > 1){
                query.page = this.query.page
            }

            router.push({query: query,  params: {scrollBehavior: scrollTop}})
            this.debounce(callback)
        },
        reload(){
            callback.apply(null, [this.query])
        }
    }

    worker.init()
    return worker

}