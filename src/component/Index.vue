<template>
  <q-input
    :error="hasError"
    :model-value="number"
    class="vue3-q-tel-input no-inherit-feedback"
    @update:model-value="phoneChanged"
    :maxlength="prevValue.length"
    v-bind="$props"
  >
    <template #prepend>
      <CountrySelection
        :use-icon="useIcon"
        :search-text="searchText"
        :search-icon="searchIcon"
        v-model:country="country"
        @countryChanged="countryChanged()"
        :readonly="readonly"
        :disable="disable"
        :dense="dense"
        :no-results-text="noResultsText"
        v-bind="dropdownOptions"
        class="no-border-field-before no-padding-field font-reduced-input-adon"
      >
        <template v-for="slot of countrySelectSlots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope ?? {}"></slot>
        </template>
      </CountrySelection>
    </template>
    <template v-for="slot of inputSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope ?? {}"></slot>
    </template>
  </q-input>
</template>

<script lang="ts" setup>
import CountrySelection from './CountrySelection.vue'
import { Country } from './types'
import { CountryCode, isValidPhoneNumber, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js'
import { getCountryByDialCode, getDefault, getCountryCodeFromPhoneNumber } from './countries'
import { QInput } from 'quasar'
import { ref, computed, onMounted, watch, nextTick } from 'vue'

export type Vue3QTelInputProps = {
  tel?: string | number
  required?: boolean
  searchText?: string
  searchIcon?: string
  dropdownOptions?: Record<string, unknown> // TODO: rewise later
  noResultsText?: string
  defaultCountry?: string
  eagerValidate?: boolean
  useIcon?: boolean
  readonly?: boolean
  dense?: boolean
  disable?: boolean
  disableAutoCountrySelection?: boolean
}

const $props = withDefaults(defineProps<Vue3QTelInputProps>(), {
  tel: '',
  required: false,
  searchText: 'Search',
  searchIcon: 'search',
  dropdownOptions: () => ({}),
  noResultsText: 'No results found',
  defaultCountry: 'us',
  eagerValidate: true,
  useIcon: false,
  readonly: false,
  dense: false,
  disable: false,
  disableAutoCountrySelection: false,
})

const tel = defineModel<string>('tel', {
  default: () => '',
})

const $emit = defineEmits<{
  input: [string]
  error: [boolean]
  country: [Country]
}>()

const $slots = defineSlots()

const country = ref<Country>(getDefault() as Country)
const oldCountry = ref<Country | undefined>(undefined)
const number = ref('')
const hasError = ref(false)
const prevValue = ref('01234567890123456789')
const phoneNumber = ref<PhoneNumber | undefined>(undefined)

const inputSlots = computed(() => Object.keys($slots).filter(slotName => !slotName.startsWith('cs-')))
const countrySelectSlots = computed(() =>
  Object.keys($slots)
    .filter(slotName => slotName.startsWith('cs-'))
    .map(slotName => slotName.substring(3)),
)

onMounted(() => {
  country.value = getDefault($props.defaultCountry) as Country
})

const getNumber = (instance: PhoneNumber, international = false): string => {
  if (!phoneNumber.value) {
    return ''
  }

  let phone: string = international ? instance.formatInternational() : instance.formatNational()
  if (phone.indexOf('0') === 0) {
    phone = phone.replace(/^0/, '')
  }

  return phone
}

const setPhone = () => {
  let currentCountry = country.value
  if (!$props.disableAutoCountrySelection && tel.value.toString() !== '') {
    const inCountry = getCountryCodeFromPhoneNumber(tel.value.toString())
    if (inCountry && country.value.iso2 !== inCountry.iso2) {
      currentCountry = inCountry
      nextTick(() => {
        country.value = currentCountry
      })
    }
  }

  try {
    phoneNumber.value = parsePhoneNumber(tel.value.toString().trim(), currentCountry.iso2 as CountryCode)
    number.value = getNumber(phoneNumber.value)
    hasError.value = !isValidPhoneNumber(phoneNumber.value.formatInternational(), currentCountry.iso2 as CountryCode)
  } catch (e) {
    phoneNumber.value = undefined
    hasError.value = $props.eagerValidate ? (tel.value.toString().trim() === '' ? $props.required : true) : false
    number.value = tel.value.toString().trim()
  }

  $emit('error', hasError.value)
}

const phoneChanged = (val: string | number | null) => {
  val = val === null ? '' : val.toString()
  let phone: PhoneNumber | undefined
  try {
    phone = parsePhoneNumber(val.trim(), country.value.iso2 as CountryCode)
  } catch {
    phone = undefined
  }
  const filtered_val = val.replace(/ /g, '')
  if (filtered_val.length > 2 && filtered_val.indexOf('+') === 0) {
    // some country code is in action
    const newCountry = getCountryByDialCode(filtered_val)
    if (newCountry) {
      country.value = newCountry
      countryChanged(filtered_val.replace(`+${newCountry.dialCode}`, ''))
    }
  }

  const num = phone ? getNumber(phone) : val
  prevValue.value =
    phone && isValidPhoneNumber(phone.formatInternational(), country.value.iso2 as CountryCode)
      ? getNumber(phone, true)
      : prevValue.value

  if (num.replace(/ /g, '').length > prevValue.value.replace(/ /g, '').length) {
    return setPhone() // no need to update as its not valid
  }

  tel.value = phone ? phone.formatInternational() : ''
  $emit('input', phone ? phone.formatNational() : val.trim())
}

const countryChanged = (val = '') => {
  prevValue.value = '01234567890123456789'
  let value = ((val || tel.value).toString() || '').trim()
  if (oldCountry.value) {
    if (value.startsWith('+')) {
      value = value.replace(`+${oldCountry.value.dialCode}`, '').trim()
    }
  }

  phoneChanged(value)
  nextTick(setPhone)
}

watch(() => $props.tel, setPhone, { immediate: true })
watch(
  () => $props.defaultCountry,
  () => {
    if ($props.defaultCountry) {
      country.value = getDefault($props.defaultCountry) as Country
    }
  },
  {
    immediate: true,
  },
)
watch(
  () => country.value,
  () => {
    $emit('country', country.value)
    nextTick(() => {
      oldCountry.value = country.value
    })
  },
  {
    immediate: true, // TODO: check if this is needed
  },
)
</script>

<style lang="scss">
@import '../style';
</style>
