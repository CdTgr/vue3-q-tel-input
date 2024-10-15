import { Country } from './types'
import { countryInformation as all } from './data'

export default all

export const getDefault = (country = 'us') => all.find(a => a.iso2 === country.trim().toUpperCase())

export const getCountryCodeFromPhoneNumber = (number: string) => {
  number = number.trim()
  if (number.indexOf('+') === 0) {
    number = number.slice(1)
  }
  return all.find(f => number.indexOf(f.dialCode) === 0)
}

export const getCountryByDialCode = (val = '') => all.find(f => f.dialCode && val.indexOf(`+${f.dialCode}`) !== -1)

export const filterCountries = (term: string): Country[] => {
  term = term.indexOf('+') === 0 ? term.replace('+', '') : term
  return all.filter(f => {
    if (f.dialCode.toLowerCase().indexOf(term) !== -1) return true
    if (f.iso2.toLowerCase().indexOf(term) !== -1) return true
    if (f.name.toLowerCase().indexOf(term) !== -1) return true
    return false
  })
}
