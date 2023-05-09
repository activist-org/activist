<template>
  <div
    id="popup"
    class="fixed top-0 z-10 flex flex-col items-center hidden w-full h-screen overflow-hidden cursor-pointer bg-light-popup dark:bg-dark-popup"
  >
    <div
      class="absolute right-0 mt-8 mr-24 text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text"
    >
      <Icon name="bi:x-circle-fill" class="w-10 h-10" />
    </div>
    <div class="flex flex-col items-center justify-center w-4/5">
      <img
        id="popup-image"
        src=""
        alt="Enlarged mockups of the activist.org designs."
        class="object-contain p-12"
      />
    </div>
  </div>
</template>
<script>
export default {};
</script>
