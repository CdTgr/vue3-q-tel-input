export interface Country {
  name: string;
  iso2: string;
  dialCode: string;
  native?: string;
  continent_name?: string;
  capital?: string;
  currency?: string;
  languages?: string[];
  emoji?: string;
  emojiU?: string;
}
