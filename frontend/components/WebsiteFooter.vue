<template>
  <div class="h-px mx-auto bg-light-section-div dark:bg-dark-section-div"></div>
  <footer
    class="px-14 py-12 mx-auto bg-light-header-bg dark:bg-dark-header-bg text-light-text dark:text-dark-text"
  >
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex h-8">
          <ActivistLogo />
        </div>
        <p class="max-w-md mt-3 text-med">
          Free, open-source activism network.
        </p>
        <div class="grid grid-cols-11 max-w-xs mt-5 text-med">
          <div class="col-span-5 hover:font-semibold">
            <NuxtLink to="/legal/trademark-policy"> Trademark Policy </NuxtLink>
          </div>
          <div class="col-span-1 ml-[-16px]">•</div>
          <div class="col-span-5 hover:font-semibold ml-[-28px]">
            <NuxtLink to="/legal/privacy-policy"> Privacy Policy </NuxtLink>
          </div>
        </div>
        <p class="max-w-md mt-2 text-med">Copyright © 2023 activist.</p>
      </div>
      <div class="grid grid-cols-3 gap-24 max-w-lg">
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
