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
import { Options, Vue } from 'vue-class-component'
import { Model, Prop, Watch } from 'vue-property-decorator'
import CountrySelection from './CountrySelection.vue'
import { Country } from './types'
import { PhoneNumberUtil, PhoneNumber, PhoneNumberFormat } from 'google-libphonenumber'
import { getCountryByDialCode, getDefault } from './countries'
import { QInput } from 'quasar'

const phoneNumberUtil: PhoneNumberUtil = new PhoneNumberUtil()

@Options({
  name: 'vue3-q-tel-input',
  components: {
    CountrySelection,
    QInput,
  },
  emits: [
    'input',
  ],
})
export default class Vue3QTelInput extends Vue {

  @Model('tel', { type: [ String, Number ], default: () => '' })
  tel!: string|number

  @Prop({ type: Boolean, default: () => false })
  required!: boolean

  @Prop({ type: String, default: () => 'Search' })
  searchText!: string

  @Prop({ type: Object, default: () => ({}) })
  dropdownOptions!: any

  @Prop({ type: String, default: () => 'us' })
  defaultCountry!: string
  
  country: Country = getDefault()
  old_country!: Country
  number: string = ''
  has_error: boolean = false
  prev_value: string = '01234567890123456789'
  private phone_number!: PhoneNumber|undefined
  
  @Watch('tel', { immediate: true })
  telModelChanged () {
    this.setPhone()
  }

  @Watch('country', { immediate: true })
  countryChangedWatch () {
    this.$nextTick(() => {
      this.old_country = this.country
    })
  }

  mounted () {
    this.country = getDefault(this.defaultCountry)
  }

  private getNumber (instance: PhoneNumber): string {
    if (! this.phone_number) return ''
    let phone: string = phoneNumberUtil.format(instance, PhoneNumberFormat.NATIONAL)
    if (phone.indexOf('0') === 0) phone = phone.replace(/^0/, '')
    return phone
  }

  private setPhone () {
    try {
      this.phone_number = phoneNumberUtil.parse(this.tel.toString().trim(), this.country.iso2)
      this.number = this.getNumber(this.phone_number)
      this.has_error = ! phoneNumberUtil.isValidNumberForRegion(this.phone_number, this.country.iso2)
    } catch (e) {
      this.phone_number = undefined
      this.has_error = this.tel.toString().trim() === '' ? this.required : true
      this.number = this.tel.toString().trim()
    }
  }

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
  }

  countryChanged (val?: string, force?: boolean) {
    this.prev_value = '01234567890123456789'
    const value = (force ? (val || '') : (val || this.tel).toString()).trim()
    this.phoneChanged(value.replace(`+${this.old_country.dialCode}`, `+${this.country.dialCode}`))
  }

}
</script>

<style lang="scss">
@import '../style';
</style>
