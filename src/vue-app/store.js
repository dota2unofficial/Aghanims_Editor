import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        path: null,
        categories: {},
        details: {},
        selected: null,
    },
    getters: {
        getPath: state => state.path,
        getCategories: state => state.categories,
        getDetails: state => state.details,
        getSelected: state => state.selected,
    },
    mutations: {
        setPath(state, path) {
            state.path = path
        },
        setCategories(state, categories) {
            state.categories = categories
        },
        setDetails(state, details) {
            state.details = details
        },
        setSelected(state, selected) {
            state.selected = selected
        },
    },
})

export default store