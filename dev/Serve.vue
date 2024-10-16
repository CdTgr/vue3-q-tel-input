<template>
  <div id="app" class="q-pa-md">
    <div class="row">
      <div class="col-3 offset-3 q-mt-lg">
        <vue3-q-tel-input
          v-model="input"
          v-model:country="country"
          search-text="Search using code/country"
          dense
          filled
          default-country="de"
          no-results-text="Sample here"
          readonly
        />
        <!-- <vue3-q-tel-input v-model="input" filled>
          <template #append>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
            </q-avatar>
          </template>
        </vue3-q-tel-input>
        <vue3-q-tel-input v-model="input" filled>
          <template #cs-before-options>
            <q-item>
              <q-item-section> This renders as before-options q-select slot in country list </q-item-section>
            </q-item>
          </template>
        </vue3-q-tel-input> -->
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
