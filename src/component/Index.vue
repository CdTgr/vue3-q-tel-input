<template>
  <q-input
    :error="has_error"
    :model-value="number"
    class="vue3-q-tel-input no-inherit-feedback"
    @update:model-value="phoneChanged"
    :maxlength="prev_value.length"
    :v-bind="$props"
  >
    <template v-slot:prepend>
      <CountrySelection
        :searchText="searchText"
        v-model:country="country"
        @countryChanged="countryChanged()"
        v-bind="dropdownOptions"
        class="no-border-field-before no-padding-field font-reduced-input-adon"
      />
    </template>
  </q-input>
</template>

<script lang="ts">
import CountrySelection from './CountrySelection.vue'
import { Country } from './types'
import { PhoneNumberUtil, PhoneNumber, PhoneNumberFormat } from 'google-libphonenumber'
import { getCountryByDialCode, getDefault } from './countries'
import { QInput } from 'quasar'
import { defineComponent, ref, Ref } from '@vue/runtime-core'

const phoneNumberUtil: PhoneNumberUtil = new PhoneNumberUtil()

export default defineComponent({
  name: 'vue3-q-tel-input',
  components: {
    CountrySelection,
    QInput,
  },
  props: {
    tel: { type: [ String, Number ], default: () => '' },
    required: { type: Boolean, default: () => '' },
    searchText: { type: String, default: () => 'Search' },
    dropdownOptions: { type: Object, default: () => ({}) },
    eagerValidate: { type: Boolean, default: true },
  },
  emits: [
    'update:tel',
    'input',
    'error'
  ],
  setup () {
    const country: Ref<Country> = ref(getDefault())
    const old_country: Ref<Country|undefined> = ref(undefined)
    const number: Ref<string> = ref('')
    const has_error: Ref<boolean> = ref(false)
    const prev_value: Ref<string> = ref('01234567890123456789')
    const phone_number: Ref<PhoneNumber|undefined> = ref(undefined)
    return {
      country,
      old_country,
      number,
      has_error,
      prev_value,
      phone_number,
    }
  },
  mounted () {
    this.country = getDefault(this.defaultCountry)
  },
  watch: {
    tel: {
      immediate: true,
      handler () {
        this.setPhone()
      },
    },
    country: {
      immediate: true,
      handler () {
        (this as any).$nextTick(() => {
          this.old_country = this.country
        })
      }
    }
  },
  methods: {
    getNumber (instance: PhoneNumber): string {
      if (! this.phone_number) return ''
      let phone: string = phoneNumberUtil.format(instance, PhoneNumberFormat.NATIONAL)
      if (phone.indexOf('0') === 0) phone = phone.replace(/^0/, '')
      return phone
    },
    setPhone () {
      try {
        this.phone_number = phoneNumberUtil.parse(this.tel.toString().trim(), this.country.iso2)
        this.number = this.getNumber(this.phone_number)
        this.has_error = ! phoneNumberUtil.isValidNumberForRegion(this.phone_number, this.country.iso2)
      } catch (e) {
        this.phone_number = undefined;
        this.has_error = !this.eagerValidate
          ? false
          : this.tel.toString().trim() === ""
          ? this.required
          : true;
        this.number = this.tel.toString().trim();
      }
      this.$emit('error', this.has_error)
    },
    phoneChanged (val: string) {
      let phone: PhoneNumber|undefined
      try {
        phone = phoneNumberUtil.parse(val.toString().trim(), this.country.iso2)
      } catch {
        phone = undefined
      }
      const filtered_val = val.replace(/\ /g, '')
      if (filtered_val.length > 2 && filtered_val.indexOf('+') === 0) {
        // some country code is in action
        const country = getCountryByDialCode(filtered_val)
        if (country) {
          this.country = country
          this.countryChanged(filtered_val.replace(`+${country.dialCode}`, ''))
        }
      }
      const num = phone ? this.getNumber(phone) : val
      this.prev_value = phone && phoneNumberUtil.isValidNumberForRegion(phone, this.country.iso2) ? this.getNumber(phone) : this.prev_value
      if (num.replace(/\ /g, '').length > this.prev_value.replace(/\ /g, '').length) return this.setPhone() // no need to update as its not valid
      this.$emit('update:tel', phone ? phoneNumberUtil.format(phone, PhoneNumberFormat.INTERNATIONAL) : val.trim())
      this.$emit('input', phone ? phoneNumberUtil.format(phone, PhoneNumberFormat.INTERNATIONAL) : val.trim())
    },
    countryChanged (val?: string, force?: boolean) {
      this.prev_value = '01234567890123456789'
      const value = (force ? (val || '') : (val || this.tel).toString()).trim()
      this.phoneChanged(this.old_country ? value.replace(`+${this.old_country.dialCode}`, `+${this.country.dialCode}`) : value)
    },
  },
})
</script>

<style lang="scss">
@import '../style';
</style>
