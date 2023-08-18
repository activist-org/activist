<template>
    <div class="px-6 py-5 card-style">
        <div class="flex flex-col gap-3">
            <label for="feedback">
                <h3 class="text-left responsive-h3 font-display">{{ header }}</h3>
            </label>
            <p v-if="description">{{ description }}</p>
            <!-- Mobile -->
            <div v-if="multiline" >
            <textarea id="feedback" aria-label="organization-feedback" type="text"
                :placeholder="placeholder"
                class="px-3 py-2 rounded-md w-full block md:hidden bg-transparent border border-white dark:border-white resize-none md:resize-y overflow-y-scroll md:overflow-hidden"
                rows="5"></textarea>
            <!-- Desktop -->
            <textarea id="feedback" aria-label="organization-feedback" type="text"
                :placeholder="placeholder"
                class="px-3 py-2 rounded-md w-full hidden md:block  bg-transparent border border-white dark:border-white resize-none md:resize-y overflow-y-scroll md:overflow-hidden"
                rows="3"></textarea>
            </div>
            <input v-else id="feedback" type="text" aria-label="organization-feedback" :placeholder="placeholder"
                class="px-3 py-2 rounded-md bg-transparent border border-white dark:border-white resize-none md:resize-y overflow-y-scroll md:overflow-hidden">
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    header: string;
    description: string;
    placeholder: string;
    multiline: boolean;
}>();
</script>