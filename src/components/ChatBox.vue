<template>
    <div id="ChatBox">
        <div class="col-md-9 ChatBox__Left">
            <div class="ChatBox__List">
                <chat-message v-for="message in messages" :data="message"></chat-message>
            </div>

            <div class="ChatBox__Input">
                <form @submit="sendMessage" action="/" method="post">
                    <input type="text" v-model="newMessage" placeholder="Enter your message here">
                </form>
            </div>
        </div>

        <div class="col-md-3 ChatBox__Right">
            <h3>Online Users</h3>

            <ul class="ChatBox__OnlineUsers">
                <li v-for="user in onlineUsers">
                    {{ user }}

                    <a href="#" :data-username="user" @click="kickUser" v-if="isAdmin">[ kick ]</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import ChatMessage from './ChatMessage.vue'

    export default {
        components: { ChatMessage },

        data() {
            return {
                newMessage: '',
                messages: [],
                onlineUsers: []
            }
        },

        ready() {
            let chatbox = this

            this.$parent.socket.on('message received', function(message) {
                chatbox.messages.push(message)
            })

            this.$parent.socket.on('user joined', function(message) {
                chatbox.messages.push(message)
                chatbox.onlineUsers.push(message.username)
            })

            this.$parent.socket.on('user left', function(message) {
                chatbox.messages.push(message)
                chatbox.onlineUsers.$remove(message.username)
            })
        },

        methods: {
            sendMessage(event) {
                event.preventDefault()

                this.$parent.socket.emit('send message', this.newMessage)

                this.newMessage = ''
            },

            kickUser(event) {
                event.preventDefault()

                // Get the username of the user we're kicking
                let usernameToKick = event.target.getAttribute('data-username')

                // Tell the server to kick them from the chat
                this.$parent.socket.emit('kick user', usernameToKick)
            }
        },

        computed: {
            // Surely there must be a better way to do this? @TODO
            isAdmin() {
                return this.$parent.isAdmin
            }
        }
    }
</script>

<style>
    #ChatBox {
        width: 100%;
        height: 100%;
        margin-right: 0;
    }

    #Chat__ChatBox ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .ChatBox__Left {
        padding-right: 0;
    }

    .ChatBox__Right {
        height: 100vh;
        border-left: 1px solid #eee;
        background: #F7F7F7;
        box-shadow: -10px 0 40px #F1F1F1;
    }

    .ChatBox__List {
        height: 90vh;
        overflow: scroll;
    }

    .ChatBox__Input {
        height: 10vh;
        background: #eee;
        border-top: 3px solid #ddd;
        padding: 20px;
    }

    .ChatBox__Input input {
        width: 100%;
        background: white;
        padding: 10px;
    }

    .ChatBox__Input input:focus {
        outline: none;
    }

    ul.ChatBox__OnlineUsers {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    h3 {
        margin-top: 20px;
        text-transform: uppercase;
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: bold;
        color: #999;
    }
</style>