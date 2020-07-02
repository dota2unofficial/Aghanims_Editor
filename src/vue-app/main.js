import Vue from "vue"
import Vuetify from 'vuetify'
import App from "@/App.vue"

import store from './store'

import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)

Vue.config.productionTip = false;

new Vue({
	template: "<app />",
	components: { App },
	store: store,
	vuetify: new Vuetify({})
}).$mount("#app")
