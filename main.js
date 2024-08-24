import Vue from 'vue'
import App from './App'

Vue.prototype.towxml = require('./wxcomponents/towxml/index.js')

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
