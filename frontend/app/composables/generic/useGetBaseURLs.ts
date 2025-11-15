// SPDX-License-Identifier: AGPL-3.0-or-later
const ACTIVIST_URL = "https://activist.org";

const BASE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
const BASE_BACKEND_URL = import.meta.env.VITE_API_URL;
const BASE_BACKEND_URL_NO_V1 = import.meta.env.VITE_BACKEND_URL;
const FRIENDLY_CAPTCHA_KEY = import.meta.env
  .VITE_FRIENDLY_CAPTCHA_SITE_KEY;
const REQUEST_ACCESS_URL =
  "https://forms.activist.org/s/cm30ujrcj0003107fqc75yke8"
export const useGetBaseURLs = () => {
  return {
    BASE_FRONTEND_URL,
    BASE_BACKEND_URL,
    BASE_BACKEND_URL_NO_V1,
    ACTIVIST_URL,
    REQUEST_ACCESS_URL,
    FRIENDLY_CAPTCHA_KEY,
  };
}
