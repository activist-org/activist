<template>
  <div class="grid w-fit grid-flow-row gap-3 sm:grid-flow-col md:gap-5">
    <ShieldApp class="fill-light-text dark:fill-dark-text" href="/">
      <Icon name="simple-icons:apple" size="2em" />
      <div class="ml-4 place-self-center pb-1">
        <div class="ml-0.5 whitespace-nowrap text-xs font-semibold leading-4">
          {{ $t("components.grid-app-shields.download-on-the") }}
        </div>
        <div class="whitespace-nowrap text-2xl font-semibold leading-4">
          {{ $t("components.grid-app-shields.app-store") }}
        </div>
      </div>
    </ShieldApp>
    <ShieldApp class="fill-light-text dark:fill-dark-text" href="/">
      <Icon name="simple-icons:googleplay" size="2em" />
      <div class="ml-4 place-self-center pb-1">
        <div
          class="ml-0.5 whitespace-nowrap text-xs font-semibold uppercase leading-4"
        >
          {{ $t("components.grid-app-shields.get-it-on") }}
        </div>
        <div class="whitespace-nowrap text-2xl font-semibold leading-4">
          {{ $t("components.grid-app-shields.google-play") }}
        </div>
      </div>
    </ShieldApp>
    <ShieldApp class="fill-light-text dark:fill-dark-text" href="/">
      <Icon name="simple-icons:fdroid" size="2em" />
      <div class="ml-4 place-self-center pb-1">
        <div
          class="ml-0.5 whitespace-nowrap text-xs font-semibold uppercase leading-4"
        >
          {{ $t("components.grid-app-shields.get-it-on") }}
        </div>
        <div class="whitespace-nowrap text-2xl font-semibold leading-4">
          {{ $t("components.grid-app-shields.f-droid") }}
        </div>
      </div>
    </ShieldApp>
  </div>
</template>
