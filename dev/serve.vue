<template>
  <div id="app" class="q-pa-md">
    <div class="row">
      <div class="col-3 offset-3 q-mt-lg">
        <vue3-q-tel-input
          v-model="input"
          searchText="Search using code/country"
          dense
          filled
          default-country="de"
          v-model:country="country"
          no-results-text="Sample here"
        />
      </div>
    </div>
    <div>Entered telephone number : {{ input }}</div>
    <div>
      Country :
      <pre>{{ JSON.stringify(country, null, 4) }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Vue3QTelInput from '@/component/Index.vue'
import { ref } from 'vue'

const input = ref('+12122066540')
const country = ref()
</script>
