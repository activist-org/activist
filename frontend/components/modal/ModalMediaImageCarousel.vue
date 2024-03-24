<template>
  <div class="relative">
    <MediaImageCarousel
      :fullscreen="false"
      :class="{ 'lg:hidden': textExpanded }"
    />

    <button class="absolute right-2 bottom-2 z-10">
      <Icon
        class="w-12 h-12 border-solid border border-white border-opacity-80 bg-black bg-opacity-80 rounded-lg"
        name="bi:plus-lg"
      />
    </button>

    <ModalBase>
      <template #normalDisplay>
        <button class="absolute right-2 top-2 z-10">
          <Icon
            class="w-12 h-12 border-solid border border-white border-opacity-80 bg-black bg-opacity-80 rounded-lg"
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
