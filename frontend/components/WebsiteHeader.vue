<template>
  <header class="sticky top-0 z-10 bg-light-header dark:bg-dark-header drop-shadow-md">
    <div class="flex py-2 sm:hidden">
      <div class="z-0 flex justify-center mx-auto">
        <LogosActivist class="h-6" />
      </div>
      <div class="absolute right-0 mr-4">
        <MeatballMenu />
      </div>
    </div>
    <div class="hidden py-3 mx-auto sm:block">
      <div class="flex items-center justify-between px-8 md:px-6 lg:px-10 xl:px-14">
        <div class="flex items-center space-x-6 xl:space-x-8">
          <LogosActivist class="h-8" />
          <VersionLabel class="hidden lg:block" label="alpha v0.0.1" linkTo="/docs/roadmap" />
          <VersionLabel class="hidden md:block lg:hidden" label="v0.0.1" linkTo="/docs/roadmap" />
        </div>
        <div>
          <div class="flex items-center space-x-4 xl:space-x-6">
            <ThemeSelector />
            <LanguageSelector />
            <LabeledBtn
              :cta="true"
              label="get-in-touch"
              linkTo="/help/contact"
              fontSize="sm"
              class="hidden md:block"
            />
            <div>
              <MeatballMenu class="md:hidden"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
