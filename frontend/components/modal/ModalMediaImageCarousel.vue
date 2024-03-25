<template>
  <div class="relative">
    <MediaImageCarousel
      :fullscreen="false"
      :class="{ 'lg:hidden': textExpanded }"
    />

    <button class="absolute bottom-2 right-2 z-10">
      <Icon
        class="h-12 w-12 rounded-lg border border-solid border-white border-opacity-80 bg-black bg-opacity-80"
        name="bi:plus-lg"
      />
    </button>

    <ModalBase>
      <template #normalDisplay>
        <button class="absolute right-2 top-2 z-10">
          <Icon
            class="h-12 w-12 rounded-lg border border-solid border-white border-opacity-80 bg-black bg-opacity-80"
            name="ic:outline-fullscreen"
          />
        </button>
      </template>

      <template #modalDisplay>
        <MediaImageCarousel
          :fullscreen="true"
          :class="{ 'lg:hidden': textExpanded }"
        />
      </template>
    </ModalBase>
  </div>
</template>
