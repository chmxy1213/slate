import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia';

// pinia pulgin of save data to local
function testpuglin(context) {
    console.log(context);
    // return (store) => {
    //     store.subscribe((mutation, state) => {
    //         console.log(mutation);
    //         console.log(state);
    //         localStorage.setItem("pinia", JSON.stringify(state));
    //     });
    // };
}

const app = createApp(App);
const pinia = createPinia();
// pinia.use(testpuglin());

app.use(router);
app.use(pinia); 

app.mount("#app");
