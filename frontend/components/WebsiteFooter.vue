<template>
  <footer
    class="px-12 py-3 pb-10 mx-auto bg-light-header-bg dark:bg-dark-header-bg"
  >
    <div class="flex justify-end mt-5">
      <div class="flex-1">
        <ActivistLogo />
        <p class="max-w-md mt-3 text-med text-light-text dark:text-dark-text">
          Free, open-source activism network.
        </p>
        <div
          class="flex space-x-2 max-w-md mt-5 text-med text-light-text dark:text-dark-text"
        >
          <div class="hover:font-semibold">
            <NuxtLink to="/legal/trademark-policy"> Trademark Policy </NuxtLink>
          </div>
          <div>•</div>
          <div class="hover:font-semibold">
            <NuxtLink to="/legal/privacy-policy"> Privacy Policy </NuxtLink>
          </div>
          <div>•</div>
          <div class="hover:font-semibold">
            <NuxtLink to="/legal/cookies"> Cookies </NuxtLink>
          </div>
        </div>
        <p class="max-w-md mt-2 text-med text-light-text dark:text-dark-text">
          Copyright © 2023 activist.
        </p>
      </div>
      <div class="flex space-x-20 text-light-text dark:text-dark-text">
        <div>
          <p class="text-xl">Connect</p>
          <p class="mt-3 text-med hover:font-semibold">
            <a href="https://github.com/activist-org/activist">@activist-org</a>
          </p>
          <p class="mt-2 text-med hover:font-semibold">
            <a href="https://twitter.com/activist_org">@activist_org</a>
          </p>
          <p class="mt-2 text-med hover:font-semibold">
            <a href="https://instagram.com/activist_org">@activist_org</a>
          </p>
        </div>
        <div>
          <p class="text-xl">Resources</p>
          <p class="mt-3 text-med hover:font-semibold">
            <NuxtLink to="/help"> Help </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:font-semibold">
            <NuxtLink to="/docs"> Documentation </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:font-semibold">
            <NuxtLink to="/help/contact"> Contact </NuxtLink>
          </p>
        </div>
        <div>
          <p class="text-xl">Organization</p>
          <p class="mt-3 text-med hover:font-semibold">
            <NuxtLink to="/about"> About </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:font-semibold">
            <NuxtLink to="/supporters"> Supporters </NuxtLink>
          </p>
          <p class="mt-2 text-med hover:font-semibold">
            <NuxtLink to="/impress"> Impress </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
