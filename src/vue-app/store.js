import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        path: null,
        categories: {},
        details: {},
        selected: null,
        fileLoading: false,
        d2Found: true,
        d2Path: null,
        localization: {},
        localizationLoading: false,
    },
    getters: {
        getPath: state => state.path,
        getCategories: state => state.categories,
        getDetails: state => state.details,
        getSelected: state => state.selected,
        getFileLoading: state => state.fileLoading,
        getD2Found: state => state.d2Found,
        getD2Path: state => state.d2Path,
        getLocalization: state => state.localization,
        getLocalizationLoading: state => state.localizationLoading,
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
        setFileLoading(state, loading) {
            state.fileLoading = loading
        },
        setD2Found(state, found) {
            state.d2Found = found
        },
        setD2Path(state, path) {
            state.d2Path = path
        },
        setLocalization(state, localization) {
            state.localization = localization
        },
        setLocalizationLoading(state, loading) {
            state.localizationLoading = loading
        },
    },
    actions: {
        findD2Path({ commit }) {
            commit('setD2Found', true)
            let dota2Path = ''
            try {
                dota2Path = findSteamAppById(570)
            } catch {
                commit('setD2Found', false)
            }
            commit('setD2Path', `${dota2Path}/game/`)
        },
        loadLocalization({ getters, commit }) {
            commit('setLocalizationLoading', true)
            console.log(getters.getD2Path)
            commit('setLocalizationLoading', false)
        }
    }
})

export default store