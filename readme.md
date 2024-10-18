### Vue3 Quasar Telephone Input

<h3 style="color:#f00;">Deprecated and moved to V2.</h3>

> V1 is no longer in development.

##### VUE3-Q-TEL-INPUT

The plugin was made over Vue3 with considering the [Quasar Framework v2.X](https://quasar.dev/). The plugin provides auto country detection on user inputs as well as dropdown for country which supports search by name, country code and country phone code.

Live preview for the code is available in [CodePen](https://codepen.io/CdTgr/full/PoMmeRZ)

Contributers are [welcome]().

---

### Version 1

> Recommended to upgarde to v2.

For v1 documenation please refer [here](./docs/v1.md)

#### Installation

##### Package manager

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
import 'vue3-q-tel-input/dist/style.css'
```

##### CDN

###### UNPKG

```
http://unpkg.com/vue3-q-tel-input@latest/dist/vue3-q-tel-input.js
http://unpkg.com/vue3-q-tel-input@latest/dist/style.css
```

###### JSDELIVR

```
https://cdn.jsdelivr.net/npm/vue3-q-tel-input@latest/dist/vue3-q-tel-input.js
https://cdn.jsdelivr.net/npm/vue3-q-tel-input@latest/dist/style.css
```

#### Usage

```
<vue3-q-tel-input v-model:tel="tel" />
```

All the props that are supported in [quasr input](https://quasar.dev/vue-components/input) field are available in the plugin as well.
_example_

```
<vue3-q-tel-input v-model:tel="tel" dense outlined />
```

All the slots that are supported in [quasar input](https://quasar.dev/vue-components/input) field are available in the plugin as input slots. Country selection element uses `#append` slot

_example_

```
<vue3-q-tel-input>
    <template v-slot:append>
        <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
        </q-avatar>
    </template>
</vue3-q-tel-input>
```

All the slots that are supported in [quasar select](https://quasar.dev/vue-components/select) field are available in the plugin as country select control slots with prefix `cs-`.

_example_

```
<vue3-q-tel-input>
    <template v-slot:cs-before-options>
        <q-item>
            <q-item-section>
                This renders as before-options q-select slot in country list
            </q-item-section>
        </q-item>
    </template>
</vue3-q-tel-input>
```

#### Model

| Model     | Type    | Description                               | Usage                        | Required |
| --------- | ------- | ----------------------------------------- | ---------------------------- | -------- |
| _default_ | string  | The telephone value                       | `v-model="telephone_number"` | ✅       |
| country   | Country | The country object, useful to get it back | `v-model:country="country"`  | ❌       |

#### Props

| Prop                           | Type    | Required | Description                                                                           |
| ------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------- |
| required                       | Boolean | No       | Shows error validation when the field is empty                                        |
| search-text                    | String  | No       | The label for the search field inside the country dropdown                            |
| search-icon                    | String  | No       | Set the icon for the search field to something else                                   |
| default-country                | String  | No       | The default country to load. eg: us, ae, de, in etc.                                  |
| dropdown-options               | Obejct  | No       | The props availalbe for the [Quasar Select](https://quasar.dev/vue-components/select) |
| eager-validate                 | Boolean | No       | Set to true if the validation needs be run on loading                                 |
| use-icon                       | Boolean | No       | Set to use the emoji icon instead of the default flag images                          |
| no-results-text                | String  | No       | Set a string when the search results nothing, default: 'No results found'             |
| disable-auto-country-selection | Boolean | No       | Prevent the input field value from changing the country selection                     |

#### Events

| Emitter | Type    | Description                                         |
| ------- | ------- | --------------------------------------------------- |
| input   | string  | Triggers when the input value changes               |
| error   | boolean | true when the input is invalid and false when valid |

### Credits

- Project uses [REST Countries](https://restcountries.com/) for generating country list.
