import countries from 'i18n-iso-countries'
// Import the languages you support
import ar from 'i18n-iso-countries/langs/ar.json'
import de from 'i18n-iso-countries/langs/de.json'
import en from 'i18n-iso-countries/langs/en.json'
import es from 'i18n-iso-countries/langs/es.json'
import fr from 'i18n-iso-countries/langs/fr.json'
import it from 'i18n-iso-countries/langs/it.json'
import pt from 'i18n-iso-countries/langs/pt.json'

// Register them once

countries.registerLocale(en)
countries.registerLocale(de)
countries.registerLocale(fr)
countries.registerLocale(es)
countries.registerLocale(it)
countries.registerLocale(ar)
countries.registerLocale(pt)

export default defineNuxtPlugin((nuxtApp) => {
  // Access the i18n instance
  const $i18n = nuxtApp.$i18n as { locale: { value: string } }

  const getCountryName = (code: string, forcedLocale?: string) => {
    // 1. Use forced locale if provided
    // 2. Or use current i18n locale (unwrapped from Ref)
    // 3. Fallback to 'en'
    const locale = forcedLocale || $i18n?.locale?.value || 'en'

    // Return the name from the library
    return countries.getName(code, locale)
  }

  const getCountries = (forcedLocale?: string) => {
    const locale = forcedLocale || $i18n?.locale?.value || 'en'
    console.log("Getting countries for locale:", locale);
    return countries.getNames(locale, { select: "official" })
  }

  return {
    provide: {
      countryName: getCountryName,
      countries: getCountries,
      isoCountries: countries
    }
  }
})
