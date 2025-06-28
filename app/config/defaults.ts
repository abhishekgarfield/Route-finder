import countries from '../components/countries.json';

export let DefaultCountry: Country = {
  name: 'United States',
  flag: '🇺🇸',
  code: 'US',
  dialCode: '+1',
};

export const setDefaultCountry = (countryCode: string = '+91') => {
  const country = countries.find(item => item.dialCode === countryCode);
  if (country) {
    DefaultCountry = country;
  }
};

export const findCountry = (countryCode: string = '+91') => {
  const country = countries.find(item => item.dialCode === countryCode);
  if (country) {
    return country;
  }
};

type Country = {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
};
