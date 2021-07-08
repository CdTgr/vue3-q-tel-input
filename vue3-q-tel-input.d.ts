import { DefineComponent, Plugin } from 'vue';

declare const Vue3QTelInput: DefineComponent<{}, {}, any> & { install: Exclude<Plugin['install'], undefined> };
export default Vue3QTelInput;
