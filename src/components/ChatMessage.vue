<template>
    <div class="Message">
        <div class="Message--Alert" v-if="isAlert">
            <strong>{{ data.message }}</strong>
        </div>

        <div class="Message--Message" v-else>
            <p class="Message__Author">
                <strong>{{ data.username }}</strong> said,
                {{ data.timestamp }}
            </p>

            <p class="Message__Content">
                {{ data.message }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['data'],

        computed: {
            isAlert() {
                return this.data.type === 'alert'
            }
        }
    }
</script>

<style>
    #ChatBox .Message {
        background: white;
        overflow: hidden;
        padding: 10px;
    }

    #ChatBox .Message:nth-child(even) {
        background: #F7F7F7;
    }

    #ChatBox .Message p {
        margin: 0;
    }

    #ChatBox .Message p.Message__Author {
        font-style: italic;
        color: #999;
        margin-bottom: 5px;
    }
</style>