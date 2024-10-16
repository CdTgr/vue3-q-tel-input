import { writeFileSync } from 'fs'
import { join } from 'path'
import type { Country } from './src/component/types'

type RestCountry = {
  name: {
    common: string
    official: string
    nativeName: Record<
      string,
      {
        official: 'República de Nicaragua'
        common: 'Nicaragua'
      }
    >
  }
  cca2: string
  idd: { root: string; suffixes: string[] }
  flag: string
}

const transformCountryList = (countries: RestCountry[]): Country[] =>
  countries
    .map(
      country =>
        ({
          name: country.name.common,
          iso2: country.cca2,
          dialCode: country.idd.root + (country.idd.suffixes?.length === 1 ? country.idd.suffixes[0] : ''),
          dialCodeSuffixes: (country.idd.suffixes?.length === 1 ? [] : country.idd.suffixes) || [],
          flag: country.flag,
          invalid: !country.idd.root,
        }) satisfies Country,
    )
    .filter(country => !country.invalid)

const getCountryList = async () => {
  const fields = ['idd', 'cca2', 'name', 'flag']
  const url = new URL('https://restcountries.com/v3.1/all')
  url.searchParams.append('fields', fields.join())
  const countries = await fetch(url).then(res => res.json())

  return transformCountryList(countries as RestCountry[])
}

const updateCountryList = async () => {
  const countries = await getCountryList()
  const data = [
    "import type { Country } from '@/component/types'",
    `export const countryInformation: Country[] = ${JSON.stringify(countries)}`,
  ].join('\n\n')

  writeFileSync(join('src', 'component', 'data.ts'), data, { encoding: 'utf-8' })
}

updateCountryList().then(console.log).catch(console.error)
