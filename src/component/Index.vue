<template>
  <q-input :error="has_error" :model-value="number" class="vue3-q-tel-input no-inherit-feedback" @update:model-value="phoneChanged" :maxlength="prev_value.length" :v-bind="$props">
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

<script lang="ts">
import CountrySelection from './CountrySelection.vue';
import { Country } from './types';
import { CountryCode, isValidPhoneNumber, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';
import { getCountryByDialCode, getDefault, getCountryCodeFromPhoneNumber } from './countries';
import { QInput } from 'quasar';
import { defineComponent, ref, Ref, computed, ComputedRef } from 'vue';

export default defineComponent({
  name: 'vue3-q-tel-input',
  components: {
    CountrySelection,
    QInput,
  },
  props: {
    tel: { type: [String, Number], default: () => '' },
    required: { type: Boolean, default: () => false },
    searchText: { type: String, default: () => 'Search' },
    searchIcon: { type: String, default: () => 'search' },
    dropdownOptions: { type: Object, default: () => ({}) },
    defaultCountry: { type: String, default: () => 'us' },
    eagerValidate: { type: Boolean, default: () => true },
    useIcon: { type: Boolean, default: () => false },
    readonly: { type: Boolean, default: () => false },
    dense: { type: Boolean, default: () => false },
    disable: { type: Boolean, default: () => false },
  },
  emits: ['update:tel', 'input', 'error'],
  setup(_, { slots }) {
    const country: Ref<Country> = ref(getDefault() as Country);
    const old_country: Ref<Country | undefined> = ref(undefined);
    const number: Ref<string> = ref('');
    const has_error: Ref<boolean> = ref(false);
    const prev_value: Ref<string> = ref('01234567890123456789');
    const phone_number: Ref<PhoneNumber | undefined> = ref(undefined);
    const inputSlots: ComputedRef<string[]> = computed(() => Object.keys(slots).filter(slotName => !slotName.startsWith('cs-')));
    const countrySelectSlots: ComputedRef<string[]> = computed(() =>
      Object.keys(slots)
        .filter(slotName => slotName.startsWith('cs-'))
        .map(slotName => slotName.substring(3)),
    );
    return {
      country,
      old_country,
      number,
      has_error,
      prev_value,
      phone_number,
      inputSlots,
      countrySelectSlots,
    };
  },
  mounted() {
    this.country = getDefault(this.defaultCountry) as Country;
  },
  watch: {
    tel: {
      immediate: true,
      handler() {
        this.setPhone();
      },
    },
    defaultCountry: {
      immediate: true,
      handler() {
        if (this.defaultCountry) {
          this.country = getDefault(this.defaultCountry) as Country;
        }
      },
    },
    country: {
      immediate: true,
      handler() {
        this?.$nextTick(() => {
          this.old_country = this.country;
        });
      },
    },
  },
  methods: {
    getNumber(instance: PhoneNumber, international = false): string {
      if (!this.phone_number) {
        return '';
      }
      let phone: string = international ? instance.formatInternational() : instance.formatNational();
      if (phone.indexOf('0') === 0) {
        phone = phone.replace(/^0/, '');
      }
      return phone;
    },
    setPhone() {
      let country = this.country;
      if (this.tel.toString() !== '') {
        const inCountry = getCountryCodeFromPhoneNumber(this.tel.toString());
        if (inCountry && this.country.iso2 !== inCountry.iso2) {
          country = inCountry;
          this.$nextTick(() => {
            this.country = country;
          });
        }
      }
      try {
        this.phone_number = parsePhoneNumber(this.tel.toString().trim(), country.iso2 as CountryCode);
        this.number = this.getNumber(this.phone_number);
        this.has_error = !isValidPhoneNumber(this.phone_number.formatInternational(), country.iso2 as CountryCode);
      } catch (e) {
        this.phone_number = undefined;
        this.has_error = this.eagerValidate ? (this.tel.toString().trim() === '' ? this.required : true) : false;
        this.number = this.tel.toString().trim();
      }
      this.$emit('error', this.has_error);
    },
    phoneChanged(val: string | number | null) {
      val = val === null ? '' : val.toString();
      let phone: PhoneNumber | undefined;
      try {
        phone = parsePhoneNumber(val.trim(), this.country.iso2 as CountryCode);
      } catch {
        phone = undefined;
      }
      const filtered_val = val.replace(/ /g, '');
      if (filtered_val.length > 2 && filtered_val.indexOf('+') === 0) {
        // some country code is in action
        const country = getCountryByDialCode(filtered_val);
        if (country) {
          this.country = country;
          this.countryChanged(filtered_val.replace(`+${country.dialCode}`, ''));
        }
      }
      const num = phone ? this.getNumber(phone) : val;
      this.prev_value = phone && isValidPhoneNumber(phone.formatInternational(), this.country.iso2 as CountryCode) ? this.getNumber(phone, true) : this.prev_value;
      if (num.replace(/ /g, '').length > this.prev_value.replace(/ /g, '').length) {
        return this.setPhone(); // no need to update as its not valid
      }
      this.$emit('update:tel', phone ? phone.formatInternational() : '');
      this.$emit('input', phone ? phone.formatNational() : val.trim());
    },
    countryChanged(val = '') {
      this.prev_value = '01234567890123456789';
      let value = ((val || this.tel).toString() || '').trim();
      if (this.old_country) {
        if (value.startsWith('+')) {
          value = value.replace(`+${this.old_country.dialCode}`, '').trim();
        }
      }
      this.phoneChanged(value);
      this.$nextTick(() => {
        this.setPhone();
      });
    },
  },
});
</script>

<style lang="scss">
@import '../style';
</style>
