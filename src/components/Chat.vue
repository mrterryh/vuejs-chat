<template>
    <div id="Chat">
        <chat-box v-if="loggedIn"></chat-box>

        <div id="Chat__Login" v-else>
            <form action="/" @submit="login">
                <input type="text" v-model="username" placeholder="Enter your username...">
            </form>
        </div>
    </div>
</template>

<script>
    import ChatBox from './ChatBox.vue'

    export default {
        data() {
            return {
                socket: null,
                loggedIn: false,
                username: ''
            }
        },

        components: { ChatBox },

        ready() {
            this.socket = io();
        },

        methods: {
            login(event) {
                event.preventDefault()

                this.loggedIn = true

                this.socket.emit('user logged in', this.username)
            }
        },

        computed: {
            isAdmin() {
                return this.username == 'admin'
            }
        }
    }
</script>

<style>
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #Chat {
        width: 100%;
        height: 100%;
    }

    #Chat__Login {
        display: flex;
        align-items: center;
        align-content: center;
        width: 100%;
        height: 100%;
    }

    #Chat__Login form {
        width: 100%;
        text-align: center;
    }

    #Chat__Login input {
        margin: 0 auto;
        font-size: 2em;
        -webkit-appearance: none;
        padding: 10px;
        border: 2px solid #eee;
    }

    #Chat__Login input:focus {
        outline: none;
        background: #eee;
    }
</style>