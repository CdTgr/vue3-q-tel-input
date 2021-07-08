<template>
  <div id="app">
    <div class="row">
      <div class="col-3 offset-3 q-mt-lg">
        <vue3-q-tel-input v-model:tel="input" searchText="Search using code/country" dense filled />
      </div>
    </div>
    <div>
      entered telephone number : {{input}}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Vue3QTelInput from '@/component/Index.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Vue3QTelInput
  },
  data () {
    return {
      input: ''
    }
  }
});
</script>
