<template>
  <q-select
    :model-value="country"
    :options="countryOptions"
    hide-bottom-space hide-dropdown-icon borderless dense
    virtual-scroll-slice-size="9999"
    class="no-inherit-feedback no-feedback v3-q-tel-input--country"
    @update:model-value="countryChanged"
    @popup-hide="search_text=''"
  >
    <template v-slot:option="scope">
      <div class="flex items-center q-pa-xs mdi-border-bottom" v-bind="scope.itemProps">
        <q-img
          :src="getIconSrc(scope.opt.iso2)"
          height="20px" width="20px"
          fit="contain"
        />
        <span class="q-ml-sm">(+{{ scope.opt.dialCode }})</span>
        <span class="q-ml-sm">{{ scope.opt.name }}</span>
      </div>
      <q-separator />
    </template>
    <template v-slot:selected-item="scope">
      <q-item
        class="q-pa-none ellipsis"
        v-bind="scope.itemProps"
        v-if="scope.opt"
        style="min-height:unset;"
      >
        <q-item-section avatar style="min-width:unset;" class="q-pr-sm">
          <q-img height="20px" width="20px" :src="getIconSrc(scope.opt.iso2)" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="ellipsis" v-html="`+${scope.opt.dialCode}`" />
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:after-options>
      <div class="v3-q-tel--country-selector last-search-item q-pa-sm">
        <q-input
          v-model="search_text"
          ref="input"
          @update:model-value="performSearch"
          dense outlined
          :label="searchText"
          class="bg-white"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
  </q-select>
</template>

<script lang="ts">
import { PropType } from '@vue/runtime-core'
import { Options, Vue } from 'vue-class-component'
import { Model, Prop } from 'vue-property-decorator'
import countries, { filterCountries } from './countries'
import { Country } from './types'
import { QSelect, QInput, QIcon, QItem, QItemSection, QImg, QSeparator, QItemLabel } from 'quasar'

@Options({
  name: 'country-selection',
  components: {
    QSelect,
    QIcon,
    QItem,
    QItemSection,
    QImg,
    QSeparator,
    QItemLabel,
    QInput
  },
  emits: [
    'countryChanged',
  ],
})
export default class CountrySelection extends Vue {

  @Model('country', { type: Object as PropType<Country>, required: true })
  country!: Country

  @Prop({ type: String, default: () => 'Search' })
  searchText!: string

  search_text: string = ''
  countryOptions: Country[] = []

  declare $refs: {
    input: QInput
  }

  mounted () {
    this.countryOptions = [ ...countries ]
  }

  performSearch () {
    console.log('here')
    const needle = this.search_text.toLowerCase().trim()
    this.countryOptions = needle === '' ? [ ...countries ] : filterCountries(needle)
  }

  getIconSrc (src: string) {
    return require(`./assets/country/${src.trim().toLowerCase()}.png`)
  }

  countryChanged (val: Country) {
    this.$emit('update:country', val)
    this.$emit('countryChanged', val)
  }

}
</script>

<style lang="scss">
.v3-q-tel-input--country {
  .q-field__control {
    background: none !important;
    &::before { display: none !important; }
  }
  .q-field__input {
    border: none !important;
  }
}
.v3-q-tel--country-selector {
  position: sticky !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
}
</style>
