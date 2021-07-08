### VUE3-Q-TEL-INPUT
---

The plugin was made over Vue3 with considering the [Qasar Frameork v2.X](https://quasar.dev/). The plugin provides auto country detection on user inputs as well as dropdown for country which supports search by name, country code and country phone code.

Contributers are welcome.

---
#### installation

yarn
```
yarn add vue3-q-tel-input
```
npm
```
npm i vue3-q-tel-input
```

Import the component as
```
import Vue3QTelInput from 'vue3-q-tel-input'
```

Import the styles as
```
import '~vue3-q-tel-input/dist/vue3-q-tel-input.esm.css'
```

#### Usage
```
<vue3-q-tel-input v-model:tel="tel" />
```

All the props that are supported in [quasr input](https://quasar.dev/vue-components/input) field are available in the plugin as well.
*example* 
```
<vue3-q-tel-input v-model:tel="tel" dense outlined />
```

#### Model
| Prop | Type | Description | Usage |
| ---- | ---- | ---- | ---- |
| tel | string or number | The telephone value | `v-model:tel="telephone_number"` |

#### Props
| Prop | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| required | Boolean | No | Shows error validation when the field is empty |
| searchText | String | No | The label for the search field inside the country dropdown |
| defaultCountry | String | No | The default country to load. eg: us, ae, in etc. |
| path | String | No | The path to get the flag icons ( must be png images ) eg: `/sample/image/` |
| dropdownOptions | Obejct | No | The props availalbe for the [Quasar Select](https://quasar.dev/vue-components/select) |
