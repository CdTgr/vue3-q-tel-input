<template>
  <q-select
    :model-value="country"
    :options="countryOptions"
    :option-disable="isDisabled"
    hide-bottom-space
    hide-dropdown-icon
    borderless
    virtual-scroll-slice-size="9999"
    class="no-inherit-feedback no-feedback v3-q-tel-input--country"
    @update:model-value="countryChanged"
    @popup-hide="search_text = ''"
    :menu-offset="[12, 0]"
    v-bind="$props"
  >
    <template v-slot:option="scope">
      <div class="flex items-center q-pa-xs mdi-border-bottom no-wrap" v-bind="scope.itemProps">
        <span v-if="!!scope.opt.iso2" :class="!useIcon ? ['v3q_tel__flag', scope.opt.iso2.toLowerCase()] : 'q-mr-sm'">{{ useIcon ? scope.opt.emoji : '' }}</span>
        <span v-if="!!scope.opt.dialCode" class="q-ml-sm text-no-wrap">(+{{ scope.opt.dialCode }})</span>
        <span :class="['q-ml-sm text-no-wrap ellipsis', { 'disabled full-width text-center': scope.opt.disabled }]">{{ scope.opt.name }}</span>
      </div>
      <q-separator />
    </template>
    <template v-slot:selected-item="scope">
      <div class="q-pa-none ellipsis" v-if="scope.opt" style="min-height: unset">
        <div class="flex items-center no-wrap">
          <span :class="!useIcon ? ['v3q_tel__flag q-mr-sm', scope.opt.iso2.toLowerCase()] : 'q-mr-sm'">{{ useIcon ? scope.opt.emoji : '' }}</span>
          <span class="ellipsis text-no-wrap" v-html="`+${scope.opt.dialCode}`"></span>
        </div>
      </div>
    </template>
    <template v-slot:after-options>
      <div class="v3-q-tel--country-selector last-search-item q-pa-sm">
        <q-input v-model="search_text" ref="input" @update:model-value="performSearch" dense outlined :label="searchText" class="bg-white">
          <template v-slot:prepend>
            <q-icon :name="searchIcon ?? 'search'" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope ?? {}"></slot>
    </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue';
import countries, { filterCountries } from './countries';
import { Country } from './types';
import { QSelect, QIcon, QSeparator, QInput } from 'quasar';

type CountryOption = Country & { disabled?: boolean };

export default defineComponent({
  name: 'country-selection',
  components: {
    QSelect,
    QIcon,
    QSeparator,
    QInput,
  },
  props: {
    country: { type: Object as PropType<Country>, required: true },
    searchText: { type: String, default: () => 'Search' },
    searchIcon: { type: String, default: () => 'search' },
    noResultsText: { type: String, default: () => 'No results found' },
    useIcon: { type: Boolean, default: () => false },
  },
  emits: ['countryChanged', 'update:country'],
  watch: {
    country: {
      immediate: true,
      handler() {
        this.search_text = '';
        this.performSearch();
      },
    },
  },
  setup() {
    const search_text: Ref<string> = ref('');
    const countryOptions: Ref<CountryOption[]> = ref([]);
    return {
      search_text,
      countryOptions,
    };
  },
  mounted() {
    this.countryOptions = [...countries];
  },
  methods: {
    performSearch() {
      const needle = this.search_text.toLowerCase().trim();
      const newCountries: CountryOption[] = needle === '' ? [...countries] : filterCountries(needle);
      if (newCountries.length === 0)
        newCountries.push({
          name: this.noResultsText,
          dialCode: '',
          iso2: '',
          disabled: true,
        });
      this.countryOptions.splice(0, this.countryOptions.length, ...newCountries);
    },
    countryChanged(val: Country) {
      this.$emit('update:country', val);
      this.$emit('countryChanged', val);
    },
    isDisabled(option: unknown) {
      if (typeof option === 'string') {
        return false;
      }
      return !!(option as CountryOption).disabled;
    },
  },
});
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
