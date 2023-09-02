<template>
	<div class="px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content">
      <ImageEvent :eventType="teste" :imgURL="teste" />
	</div>
</template>

<script setup lang="ts">
const { id } = useRoute().params;


onMounted(() => {
	redirectBasedOnScreenSize();
});

function redirectBasedOnScreenSize() {
	if (window.innerWidth > 640) {
		navigateTo(`/${id}/about`);
	}
}
</script>
