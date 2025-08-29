import axios from 'axios';
import pinia from '@/stores'
import { markRaw } from 'vue'

const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        // timeout: 1000
    })

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Token ${token}`
        return config;
    })
    return instance;
}

// baseURL: `${process.env.VUE_APP_PROTOCOL}://${process.env.VUE_APP_BACK_HOST}:${process.env.VUE_APP_PORT}`,
const axiosProteoDA = createAxiosInstance("http://localhost:8000"); //`${process.env.VUE_APP_BASE_API}`,
// const axiosProteoDA = createAxiosInstance("http://192.168.91.30:8001"); //`${process.env.VUE_APP_BASE_API}`,
const axiosDqDv = axios.create({ baseURL: "http://192.168.91.30:8001" })

pinia.use(({ store }) => {
    store.$axiosProteoDA = markRaw(axiosProteoDA)
})

export default {
    install: (app) => {
        app.config.globalProperties.$axiosProteoDA = axiosProteoDA;
        app.config.globalProperties.$axiosDqDv = axiosDqDv;
    },
}

export const apiProteoDA = axiosProteoDA