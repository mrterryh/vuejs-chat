import Vue from 'vue'
import jQuery from 'jquery'
import Chat from './components/Chat.vue'

window.app = new Vue({
    el: 'body',
    components: { Chat }
})