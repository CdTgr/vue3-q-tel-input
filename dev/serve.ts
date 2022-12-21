import { createApp } from 'vue';
import Dev from './serve.vue';
import qyasarOptions from './quasar-user-options';
import { Quasar } from 'quasar';

const app = createApp(Dev);
app.use(Quasar, qyasarOptions);
app.mount('#app');
