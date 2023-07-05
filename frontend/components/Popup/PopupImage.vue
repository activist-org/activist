<template>
  <div
    id="popup"
    class="fixed top-0 z-10 flex flex-col items-center hidden w-full h-screen overflow-hidden cursor-pointer bg-light-popup dark:bg-dark-popup"
  >
    <button
      class="absolute right-0 mt-8 mr-24 text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text"
      id="popup-close-btn"
      aria-label="Close Popup"
      @click="handleClose"
      @keydown.enter="handleClose"
    >
      <Icon 
        name="bi:x-circle-fill" 
        class="w-10 h-10"
      />
    </button>
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


<script setup>
function handleClose(event) {
  // Prevent button default behavior and stop click event propagation
  event.stopPropagation();
  event.preventDefault();

  // Toggle modal visibility
  let popup_container = document.getElementById("popup");
  popup_container.classList.toggle("hidden");

  // Refocus on modal's open button after closing the modal
  let popup_open_btn = document.getElementById("popup-open-btn");
  popup_open_btn.focus();
}
</script>

<script>
export default {};
</script>
