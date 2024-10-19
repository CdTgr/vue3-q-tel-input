<template>
  <q-select
    v-bind="$props"
    :model-value="country"
    :options="countryOptions"
    :option-disable="isDisabled"
    hide-bottom-space
    hide-dropdown-icon
    borderless
    virtual-scroll-slice-size="9999"
    class="no-inherit-feedback no-feedback v3-q-tel-input--country"
    :class="$props.class"
    :menu-offset="[12, 0]"
    @update:model-value="$emit('update:country', $event)"
    @popup-hide="searchText = ''"
    @popup-show="focusInput"
  >
    <template #option="scope">
      <div class="flex items-center q-pa-xs mdi-border-bottom no-wrap" v-bind="scope.itemProps">
        <span v-if="!!scope.opt.iso2" :class="!useIcon ? ['v3q_tel__flag', scope.opt.iso2.toLowerCase()] : 'q-mr-sm'">{{
          useIcon ? scope.opt.flag : ''
        }}</span>
        <span v-if="!!scope.opt.dialCode" class="q-ml-sm text-no-wrap">({{ scope.opt.dialCode }})</span>
        <span :class="['q-ml-sm text-no-wrap ellipsis', { 'disabled full-width text-center': scope.opt.disabled }]">{{
          scope.opt.name
        }}</span>
      </div>
      <q-separator />
    </template>
    <template #selected-item="scope">
      <div v-if="scope.opt" class="q-pa-none ellipsis" style="min-height: unset">
        <div class="flex items-center no-wrap">
          <span :class="!useIcon ? ['v3q_tel__flag q-mr-sm', scope.opt.iso2.toLowerCase()] : 'q-mr-sm'">{{
            useIcon ? scope.opt.flag : ''
          }}</span>
          <span class="ellipsis text-no-wrap">{{ scope.opt.dialCode }}</span>
        </div>
      </div>
    </template>
    <template #after-options>
      <div class="v3-q-tel--country-selector last-search-item q-pa-sm">
        <q-input
          v-model="searchText"
          dense
          outlined
          :label="searchLabel"
          class="bg-white"
          @update:model-value="performSearch"
          ref="searchInput"
        >
          <template #prepend>
            <q-icon :name="searchIcon ?? 'search'" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-for="(_, name) of $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import countries, { filterCountries } from './countries'
import { Country } from './types'
import type { QSelectProps, QSelectSlots, VueClassProp } from 'quasar'
import { QSelect, QIcon, QSeparator, QInput } from 'quasar'

type CountryOption = Country & { disabled?: boolean }

export type CountrySelectionProps = {
  searchLabel?: string
  searchIcon?: string
  noResultsText?: string
  useIcon?: boolean
  autofocusInput?: boolean
  class?: VueClassProp
} & Omit<
  QSelectProps,
  | 'modelValue'
  | 'update:modelValue'
  | 'options'
  | 'hide-bottom-space'
  | 'hide-dropdown-icon'
  | 'borderless'
  | 'borderless'
  | 'virtual-scroll-slice-size'
  | 'popup-hide'
  | 'popup-show'
>

const $props = withDefaults(defineProps<CountrySelectionProps>(), {
  searchLabel: 'Search',
  searchIcon: 'search',
  noResultsText: 'No results found',
  useIcon: false,
})

const $slots = defineSlots<Omit<QSelectSlots, 'default' | 'selected-item' | 'option' | 'after-options'>>()

const country = defineModel<Country>('country', {
  required: true,
})

const searchText = ref('')
const countryOptions = ref<CountryOption[]>([...countries])
const searchInput = ref<QInput>()

const focusInput = () => {
  nextTick(() => {
    if ($props.autofocusInput && searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const performSearch = () => {
  const needle = searchText.value.toLowerCase().trim()
  const newCountries: CountryOption[] = needle === '' ? countries.concat() : filterCountries(needle)

  if (newCountries.length === 0) {
    newCountries.push({
      name: $props.noResultsText,
      dialCode: '',
      iso2: '',
      dialCodeSuffixes: [],
      disabled: true,
    })
  }
  countryOptions.value.splice(0, countryOptions.value.length, ...newCountries)
}

const isDisabled = (option: unknown) => {
  if (typeof option === 'string') {
    return false
  }
  return !!(option as CountryOption).disabled
}

watch(
  () => country.value,
  () => {
    searchText.value = ''
    performSearch()
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss">
@import '../styles/flags';

.v3-q-tel-input--country {
  // Quasar overrides
  .q-field__control {
    background: none !important;
    &::before {
      display: none !important;
    }
  }
  .q-field__input {
    border: none !important;
  }
}
</style>
<style lang="scss" scoped>
.v3-q-tel--country-selector {
  position: sticky !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
}
.mdi-border-bottom::before {
  content: '';
}
</style>
