<template>
  <q-input
    v-bind="$props"
    v-model="dial"
    :error="hasError"
    class="vue3-q-tel-input no-inherit-feedback"
    :maxlength="prevValue.length"
    type="tel"
    @update:model-value="phoneChanged()"
  >
    <template #prepend>
      <country-selection
        :use-icon="useIcon"
        :search-text="searchText"
        :search-icon="searchIcon"
        :country="countryModel"
        :readonly="readonly"
        :disable="disable"
        :dense="dense"
        :no-results-text="noResultsText"
        v-bind="dropdownOptions"
        class="no-border-field-before no-padding-field font-reduced-input-adon"
        @update:country="countryChanged"
      >
        <template v-for="slot of countrySelectSlots" #[slot]="scope">
          <slot :name="`cs-${slot}`" v-bind="scope ?? {}" />
        </template>
      </country-selection>
    </template>
    <template v-for="slot of inputSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope ?? {}" />
    </template>
  </q-input>
</template>

<script lang="ts" setup>
import CountrySelection from './CountrySelection.vue'
import { Country } from './types'
import { CountryCode, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js'
import { getCountryByDialCode, getDefault, getProperNumber } from './countries'
import { QInput } from 'quasar'
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const DEFAULT_COUNTRY = 'de'

export type Vue3QTelInputProps = {
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
  required: false,
  searchText: 'Search',
  searchIcon: 'search',
  dropdownOptions: () => ({}),
  noResultsText: 'No results found',
  defaultCountry: DEFAULT_COUNTRY,
  eagerValidate: false,
  useIcon: false,
  readonly: false,
  dense: false,
  disable: false,
  disableAutoCountrySelection: false,
})

const $model = defineModel<string>({
  default: () => '',
})

const $emit = defineEmits<{
  input: [string]
  error: [boolean]
}>()

const $slots = defineSlots()

const countryModel = defineModel<Country>('country', { default: () => getDefault(DEFAULT_COUNTRY) })
const dial = ref('')
const hasError = ref(false)
const prevValue = ref('01234567890123456789')

const inputSlots = computed(() => Object.keys($slots).filter(slotName => !slotName.startsWith('cs-')))
const countrySelectSlots = computed(() =>
  Object.keys($slots)
    .filter(slotName => slotName.startsWith('cs-'))
    .map(slotName => slotName.replace('cs-', '')),
)

onMounted(() => {
  countryModel.value = getDefault($props.defaultCountry) as Country
})

const completeNumber = computed(() => {
  if (dial.value.startsWith('+')) {
    return getProperNumber(dial.value)
  }

  if (countryModel.value?.dialCode) {
    return getProperNumber(`${countryModel.value.dialCode}${dial.value}`)
  }

  return getProperNumber(`+${dial.value}`)
})

const isValid = computed(() => {
  if (!countryModel.value) {
    return false
  }

  try {
    const parser = parsePhoneNumber(completeNumber.value, countryModel.value.iso2 as CountryCode)
    return isValidPhoneNumber(parser.formatInternational(), countryModel.value.iso2 as CountryCode)
  } catch {}

  return false
})

const phoneChanged = () => {
  if (!dial.value) {
    return
  }

  const determinedCountry = getCountryByDialCode(completeNumber.value)
  if (determinedCountry) {
    const parsedNumber = (() => {
      try {
        return parsePhoneNumber(completeNumber.value, determinedCountry.iso2 as CountryCode)
      } catch {}
    })()
    if (parsedNumber) {
      countryModel.value = determinedCountry
      dial.value = parsedNumber.formatNational().replace(/^0/, '')
      $model.value = parsedNumber.formatInternational()
    }
  }
}

const countryChanged = (selectedCountry: Country) => {
  countryModel.value = selectedCountry
  nextTick(phoneChanged)
}

watch(
  () => $model.value,
  (val, oldVal) => {
    if (oldVal && getProperNumber(val) === completeNumber.value) {
      return
    }

    if (!oldVal) {
      dial.value = getProperNumber(val)
    }

    nextTick(phoneChanged)
  },
  { immediate: true },
)

watch(
  () => isValid.value,
  () => {
    hasError.value = !isValid.value
    $emit('error', !isValid.value)
  },
  { immediate: $props.eagerValidate },
)

watch(
  () => $props.defaultCountry,
  () => {
    if ($props.defaultCountry) {
      countryModel.value = getDefault($props.defaultCountry) as Country
    }
  },
  { immediate: true },
)
</script>

<style lang="scss">
@import '../style';
</style>
