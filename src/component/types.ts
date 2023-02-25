import { CountryCode } from 'libphonenumber-js';

export interface Country {
  name: string;
  iso2: CountryCode | string;
  dialCode: string;
  native?: string;
  continent_name?: string;
  capital?: string;
  currency?: string;
  languages?: string[];
  emoji?: string;
  emojiU?: string;
}
