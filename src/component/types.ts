import type { CountryCode } from 'libphonenumber-js'

export type Country = {
  name: string
  iso2: CountryCode | string
  dialCode: string
  dialCodeSuffixes: string[]
  flag?: string
  invalid?: boolean
}
