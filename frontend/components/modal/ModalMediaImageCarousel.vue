<template>
  <div class="relative">
    <MediaImageCarousel
      :fullscreen="false"
      :class="{ 'lg:hidden': textExpanded }"
    />
    <ModalBase>
      <template #normalDisplay>
        <button
          class="focus-brand absolute right-2 top-2 z-10 rounded-lg border border-white/80 bg-black/80 p-1 text-white/80 hover:bg-black"
        >
          <Icon class="" name="bi:fullscreen" size="1.5em" />
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
