import Vue from 'vue'
import Vuex from 'vuex'

import { findSteamAppById } from 'find-steam-app'
import fs from 'fs'
import chardet from 'chardet'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        path: null,
        categories: {},
        heros: {},
        details: {},
        selected: null,
        fileLoading: false,
        d2Found: false,
        d2Path: null,
        localization: {},
        localizationLoading: false,
        customLocalization: {},
        debugLogs: [],
        availability: true,
    },
    getters: {
        getPath: state => state.path,
        getCategories: state => state.categories,
        getHeros: state => state.heros,
        getDetails: state => state.details,
        getSelected: state => state.selected,
        getFileLoading: state => state.fileLoading,
        getD2Found: state => state.d2Found,
        getD2Path: state => state.d2Path,
        getLocalization: state => state.localization,
        getLocalizationLoading: state => state.localizationLoading,
        getDebugLogs: state => state.debugLogs,
        getCustomLocalization: state => state.customLocalization,
        getAbility: state => state.availability,
    },
    mutations: {
        setPath(state, path) {
            state.path = path
        },
        setCategories(state, categories) {
            state.categories = categories
        },
        setHeros(state, heros) {
            state.heros = heros
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
        setDebugLogs(state, logs) {
            state.debugLogs = logs
        },
        setCustomLocalization(state, localization) {
            state.customLocalization = localization
        },
        setAbility(state, availability) {
            state.availability = availability
        }
    },
    actions: {
        async findD2Path({ commit }) {
            let dota2Path = ''
            try {
                dota2Path = await findSteamAppById(570)
                if (dota2Path === undefined) { 
                    commit('setD2Found', false) 
                    return
                }
                commit('setD2Found', true)
            } catch (err) {
                commit('setD2Found', false)
                throw err
            }
            commit('setD2Path', `${dota2Path}\\game`)
        },
        addDebugLogs({ commit, getters }, log) {
            commit('setDebugLogs', [...getters.getDebugLogs, log])
        },
        loadCustomLocalization({ commit, getters }, mod) {
            const filePath = `${getters.getD2Path}\\dota_addons\\${mod}\\resource\\addon_english.txt`
            const encoding = chardet.detectFileSync(filePath)
            const result = fs.readFileSync(filePath, encoding)
            const lines = result.split('\n')

            let root = {}
            let i = 3
            while (i < lines.length - 1) {
                const line = lines[i].trim()
                if (line[0] === '"' && lines[i + 1].trim()[0] === '{' && line.length > 0) {
                    const lineName = lines[i].split('"')[1]
                    root[lineName] = {}
                    let j = i + 2
                    
                    while (lines[j].trim()[0] !== '}') {
                        const pair = lines[j].trim().split('"')
                        if (pair.length > 1 && pair[3]) root[lineName][pair[1]] = pair[3].trim()
                        j ++
                    }
                    i = j
                } else {
                    i ++
                }
            }

            commit('setCustomLocalization', root.Tokens)
        },
    }
})

export default store