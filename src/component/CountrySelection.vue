<template>
  <q-select
    :model-value="country"
    :options="countryOptions"
    hide-bottom-space hide-dropdown-icon borderless dense
    virtual-scroll-slice-size="9999"
    class="no-inherit-feedback no-feedback v3-q-tel-input--country"
    @update:model-value="countryChanged"
    @popup-hide="search_text=''"
    :menu-offset="[ 12, 0 ]"
    v-bind="$props"
  >
    <template v-slot:option="scope">
      <div class="flex items-center q-pa-xs mdi-border-bottom" v-bind="scope.itemProps">
        <q-img :src="getIconSrc(scope.opt.iso2)" width="30px" height="100%" fit="contain" no-spinner no-native-menu />
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
          <q-img height="100%" width="40px" :src="getIconSrc(scope.opt.iso2)" fit="contain" no-spinner no-native-menu />
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

  @Prop({ type: String, default: () => './assets/country/' })
  path!: string

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

  private getPath (): string {
    if (this.path.lastIndexOf('/') === this.path.length - 1) return this.path
    return `${this.path}/`
  }

  getIconSrc (src: string) {
    const path = `${this.getPath()}${src.trim().toLowerCase()}.png`
    try {
      new URL(path)
      return path
    } catch {}
    return require(path)
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
