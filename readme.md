### Vue3 Quasar Telephone Input

## ![Node version](https://img.shields.io/node/v/vue3-q-tel-input.svg?style=flat) ![Types](https://badgen.net/badge/types/included/green) [![](https://data.jsdelivr.com/v1/package/npm/vue3-q-tel-input/badge)](https://www.jsdelivr.com/package/npm/vue3-q-tel-input) [![](https://badgen.net/badge/github/vue3%2Dq%2Dtel%2Dinput/blue?icon=github)](https://github.com/CdTgr/vue3-q-tel-input) [![](https://badgen.net/badge/npm/vue3%2Dq%2Dtel%2Dinput/blue?icon=npm)](https://www.npmjs.com/package/vue3-q-tel-input)

##### VUE3-Q-TEL-INPUT

The plugin was made over Vue3 with considering the [Qasar Frameork v2.X](https://quasar.dev/). The plugin provides auto country detection on user inputs as well as dropdown for country which supports search by name, country code and country phone code.

Live preview for the code is avaialble in [CodePen](https://codepen.io/CdTgr/full/OJEMZvG)

Contributers are [welcome]().

Embed the Gist as

```
<script src="https://gist.github.com/CdTgr/a85f5548f08db62861091c7f85566026.js"></script>
```

---

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
import 'vue3-q-tel-input/dist/vue3-q-tel-input.esm.css'
```

##### CDN

###### UNPKG

```
http://unpkg.com/vue3-q-tel-input@latest/dist/vue3-q-tel-input.min.js
http://unpkg.com/vue3-q-tel-input@latest/dist/vue3-q-tel-input.esm.css
```

###### JSDELIVR

```
https://cdn.jsdelivr.net/npm/vue3-q-tel-input@latest/dist/vue3-q-tel-input.min.js
https://cdn.jsdelivr.net/npm/vue3-q-tel-input@latest/dist/vue3-q-tel-input.esm.css
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

All the slots that are supported in [quasar select](https://quasar.dev/vue-components/select) field are available in the plugin as  country select control slots with prefix `cs-`.

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

| Prop | Type             | Description         | Usage                            |
| ---- | ---------------- | ------------------- | -------------------------------- |
| tel  | string or number | The telephone value | `v-model:tel="telephone_number"` |

#### Props

| Prop             | Type    | Required | Description                                                                           |
| ---------------- | ------- | -------- | ------------------------------------------------------------------------------------- |
| required         | Boolean | No       | Shows error validation when the field is empty                                        |
| search-text      | String  | No       | The label for the search field inside the country dropdown                            |
| search-icon      | String  | No       | Set the icon for the search field to something else                                   |
| default-country  | String  | No       | The default country to load. eg: us, ae, de, in etc.                                  |
| dropdown-options | Obejct  | No       | The props availalbe for the [Quasar Select](https://quasar.dev/vue-components/select) |
| eager-validate   | Boolean | No       | Set to true if the validation needs not be run on loading                             |
| use-icon         | Boolean | No       | Set to use the emoji icon instead of the default flag images                          |

#### Events

| Emitter    | Type    | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| update:tel | string  | Triggers when an update is made to the model value  |
| input      | string  | Triggers when the input value changes               |
| error      | boolean | true when the input is invalid and false when valid |
