/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

window.Vue = require("vue");
Vue.use(require("vue-chat-scroll"));
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key)))

Vue.component("message", require("./components/message.vue"));

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: "#app",
    data: {
        dis: false,
        message: "",
        chat: {
            message: [],
            user: [],
            color: [],
            time: []
        },
        typing: "",
        numberOfUsers: 0
    },
    watch: {
        message() {
            Echo.private("chat").whisper("typing", {
                name: this.message
            });
        }
    },
    methods: {
        send() {
            if (this.message.length != 0) {
                this.dis = true;
                this.chat.message.push(this.message);
                this.chat.user.push("you");
                this.chat.color.push("success");
                this.chat.time.push(this.getTime());
                axios
                    .post("/send", {
                        message: this.message,
                        chat: this.chat
                    })
                    .then(response => {
                        console.log(response);
                        this.message = "";
                        this.dis = false;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        getTime() {
            let time = new Date();
            return time.getHours() + ":" + time.getMinutes();
        },
        getOldMessages() {
            axios
                .post("/getOldMessage")
                .then(response => {
                    console.log(response);
                    if (response.data != "") {
                        this.chat = response.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        deleteSession() {
            axios
                .post("/deleteSession")
                .then(response =>
                    this.$toaster.success("Chat history is deleted!")
                );
        }
    },
    mounted() {
        this.getOldMessages();
        Echo.private("chat")
            .listen("ChatEvent", e => {
                this.chat.message.push(e.message);
                this.chat.user.push(e.user);
                this.chat.color.push("warning");
                this.chat.time.push(this.getTime());
                axios
                    .post("/saveToSession", {
                        chat: this.chat
                    })
                    .then(response => {})
                    .catch(error => {
                        console.log(error);
                    });
            })
            .listenForWhisper("typing", e => {
                if (e.name != "") {
                    this.typing = "typing...";
                } else {
                    this.typing = "";
                }
            });
        Echo.join("chat")
            .here(user => {
                this.numberOfUsers = user.length;
            })
            .joining(user => {
                this.numberOfUsers += 1;
                this.$toaster.success(user.name + "join the chatting room");
            })
            .leaving(user => {
                this.numberOfUsers -= 1;
                this.$toaster.warning(user.name + "has left the chatting room");
            });
    }
});
