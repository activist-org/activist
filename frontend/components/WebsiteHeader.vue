<template>
  <header class="sticky top-0 z-10 bg-light-header dark:bg-dark-header drop-shadow-md">
    <div class="flex py-2 sm:hidden">
      <div class="z-0 flex justify-center mx-auto">
        <div class="relative z-0 h-6 w-20">
          <LogosActivist class="absolute inset-0 flex items-center justify-center z-1 overflow-clip" />
        </div>
      </div>
      <div class="absolute right-0 mr-4">
        <MeatballMenu />
      </div>
    </div>
    <div class="hidden py-3 mx-auto sm:block">
      <div class="flex items-center justify-between px-8 md:px-6 lg:px-10 xl:px-14">
        <div class="flex items-center md:space-x-4 lg:space-x-6 xl:space-x-8">
          <div class="relative z-0 h-10 w-36">
            <LogosActivist class="absolute inset-0 flex items-center justify-center z-1 overflow-clip" />
          </div>
          <RoadMapBtn class="hidden md:block" label="Roadmap" linkTo="/docs/roadmap" />
        </div>
        <div>
          <div class="flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
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
