import Vue from "vue"
import LiquorTree from 'liquor-tree'
import App from "@/App.vue"

Vue.config.productionTip = false;

Vue.use(LiquorTree)

new Vue({
	template: "<app />",
	components: { App }
}).$mount("#app")
