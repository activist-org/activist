<template>
  <header class="sticky top-0 z-10 bg-light-header dark:bg-dark-header">
    <div class="py-4 mx-auto">
      <div class="flex flex-wrap items-center justify-between px-14">
        <div class="flex items-center space-x-8">
          <LogosActivist class="h-8" />
          <VersionLabel label="alpha v0.0.1" linkTo="/docs/roadmap" />
        </div>
        <div>
          <div class="flex items-center space-x-8">
            <!-- <ThemeSelector /> -->
            <LanguageSelector />
            <LabeledBtn
              :cta="true"
              label="get-in-touch"
              linkTo="/help/contact"
              fontSize="base"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
