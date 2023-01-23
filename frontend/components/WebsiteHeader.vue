<template>
  <header class="bg-light-header-bg dark:bg-dark-header-bg">
    <div class="py-4 mx-auto">
      <div class="flex flex-wrap items-center justify-between px-14">
        <div class="flex items-center space-x-8">
          <LogosActivist class="h-8" />
          <VersionLabel label="alpha v0.0.1" linkTo="/docs/roadmap"/>
        </div>
        <div>
          <div class="flex items-center space-x-8">
            <!-- <ThemeSelector /> -->
            <LanguageSelector />
            <CTABtn label="Get in touch" linkTo="/help/contact" fontSize="base" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
