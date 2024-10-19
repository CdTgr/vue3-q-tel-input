<template>
  <q-input
    v-bind="$props"
    v-model="dial"
    :error="hasError"
    class="vue3-q-tel-input no-inherit-feedback"
    type="tel"
    @update:model-value="phoneChanged()"
    ref="input"
  >
    <template #prepend>
      <country-selection
        :use-icon="$props.useIcon"
        :search-text="$props.searchText"
        :search-icon="$props.searchIcon"
        :country="countryModel"
        :readonly="$props.readonly"
        :disable="$props.disable"
        :dense="$props.dense"
        :no-results-text="$props.noResultsText"
        :autofocus-input="$props.autofocusInput"
        v-bind="$props.dropdownOptions"
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
import type { CountrySelectionProps } from './CountrySelection.vue'
import { Country } from './types'
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js'
import { getCountryByDialCode, getDefault, getProperNumber } from './countries'
import { QInput, QInputProps, useFormChild } from 'quasar'
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const DEFAULT_COUNTRY = 'de'

export type Vue3QTelInputProps = {
  required?: boolean
  searchText?: string
  searchIcon?: string
  dropdownOptions?: CountrySelectionProps
  noResultsText?: string
  defaultCountry?: string
  eagerValidate?: boolean
  useIcon?: boolean
  autofocusInput?: boolean
  readonly?: boolean
  dense?: boolean
  disable?: boolean
  disableAutoCountrySelection?: boolean
} & QInputProps

const $props = withDefaults(defineProps<Vue3QTelInputProps>(), {
  required: false,
  searchText: 'Search',
  searchIcon: 'search',
  dropdownOptions: () => ({}),
  noResultsText: 'No results found',
  defaultCountry: DEFAULT_COUNTRY,
  eagerValidate: false,
  useIcon: false,
  autofocusInput: false,
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

const input = ref<QInput>()
const countryModel = defineModel<Country>('country', { default: () => getDefault(DEFAULT_COUNTRY) })
const dial = ref('')
const hasError = ref(false)

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

const _validate = (force = false) => {
  hasError.value = false

  if (!countryModel.value || !dial.value) {
    if ($props.eagerValidate) {
      hasError.value = true
      $emit('error', true)
    }
    return false
  }

  const isValid = (() => {
    try {
      return parsePhoneNumber(completeNumber.value, countryModel.value.iso2 as CountryCode).isValid()
    } catch {}

    return false
  })()

  if (force || $props.eagerValidate) {
    hasError.value = !isValid
    $emit('error', !isValid)
  }

  return isValid
}

const phoneChanged = () => {
  if (!dial.value) {
    return _validate()
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

  return _validate()
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
  () => $props.defaultCountry,
  () => {
    if ($props.defaultCountry) {
      countryModel.value = getDefault($props.defaultCountry) as Country
    }
  },
  { immediate: true },
)

// Providing native q-input support and also for using inside `q-form`
const resetValidation = () => {
  hasError.value = false
  $emit('error', false)
  input.value?.resetValidation()
}
useFormChild({
  validate: () => _validate(true),
  resetValidation,
  requiresQForm: false,
})
defineExpose({
  validate: () => _validate(true),
  resetValidation,
  select: input.value?.select,
  blur: input.value?.blur,
  focus: input.value?.focus,
  hasError,
  nativeEl: input.value?.$el as Element,
})
</script>

<style lang="scss">
@import '../style';
</style>
