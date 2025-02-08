import { locales, LOCALE_CODE } from "~/locales";
import { readFileSync } from "fs";
import { join } from "path";

// Type definition for locale files to ensure type safety
type LocaleFile = Record<string, string>;

// Cache to store loaded locale files for better performance
const cache = new Map<LOCALE_CODE, LocaleFile>();

/**
 * Resolves the correct file name based on locale code
 * @param locale - Optional locale code to resolve
 * @returns File name string (e.g. "en-US" or "de")
 */
function resolveFileName(locale?: LOCALE_CODE): string {
  // Find matching locale or use default (English)
  const localeInfo = locales.find((l) => l.code === locale) || locales[0];
  // Special case for English to use en-US.json
  return locale === LOCALE_CODE.ENGLISH ? "en-US" : localeInfo.language;
}

/**
 * Loads and caches locale files with error handling
 * @param locale - Optional locale code to load
 * @returns Parsed locale file content
 * @throws Error if fallback loading fails
 */
function loadLocaleFile(locale?: LOCALE_CODE): LocaleFile {
  // Ensure we always have a valid cache key
  const cacheKey = locale || LOCALE_CODE.ENGLISH;
  const fileName = resolveFileName(cacheKey);
  const filePath = join(process.cwd(), "frontend/i18n", `${fileName}.json`);

  try {
    // Check cache first to avoid file system access
    if (!cache.has(cacheKey)) {
      // Read and parse the JSON file synchronously
      const rawFile = readFileSync(filePath, "utf-8");
      cache.set(cacheKey, JSON.parse(rawFile));
    }
    // Return cached content with non-null assertion (safe due to check)
    return cache.get(cacheKey)!;
  } catch (error) {
    console.error(`Failed to load locale file for ${fileName}:`, error);

    // Recursive fallback to English if not already trying to load it
    if (cacheKey !== LOCALE_CODE.ENGLISH) {
      return loadLocaleFile(LOCALE_CODE.ENGLISH);
    }

    // Critical error if even fallback fails
    throw new Error("Failed to load fallback locale file");
  }
}

/**
 * Public API to get locale data with error boundary
 * @param locale - Optional locale code to retrieve
 * @returns Parsed locale data or empty object on critical failure
 */
export function getLocaleData(locale?: LOCALE_CODE): LocaleFile {
  try {
    return loadLocaleFile(locale);
  } catch (error) {
    console.error("Critical error loading locale files:", error);
    // Return empty object to prevent runtime crashes
    return {};
  }
}
