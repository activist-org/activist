<template>
  <header class="bg-light-header-bg dark:bg-dark-header-bg">
    <div class="py-4 mx-auto">
      <div class="flex flex-wrap items-center justify-between px-14">
        <div class="flex items-center space-x-8">
          <ActivistLogo class="h-8" />
          <NuxtLink to="/about"><VersionLabel label="alpha" /></NuxtLink>
        </div>
        <div>
          <NuxtLink to="/help/contact"
            ><CTABtn label="Get in touch" fontSize="base"/>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      class="h-px mx-auto bg-light-section-div dark:bg-dark-section-div"
    ></div>
  </header>
</template>
