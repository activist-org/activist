<template>
    <div
        class="px-6 py-5 bg-light-act-red/30 dark:bg-dark-act-red/30 border border-light-act-red dark:border-dark-act-red rounded-md sm:rounded-lg shadow-sm shadow-zinc-700 text-light-text dark:text-dark-text">
        <div class="flex flex-col gap-5">
            <h3 class="text-left text-light-act-red dark:text-dark-act-red responsive-h3 font-display font-bold">Dange zone
            </h3>
            <p class="">{{ description }}</p>
            <form method="post">
                <div class="grid grid-cols-1 sm:grid-cols-2 justify-between gap-4 sm:gap-8">
                    <div class="flex flex-col gap-2">
                        <label for="username" class="text-light-act-red dark:text-dark-act-red responsive-h4 font-bold"
                            placeholder="Enter your username">Your username *</label>
                        <input
                            id="username" class="py-1 px-3 bg-transparent border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-blac">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password" class="text-light-act-red dark:text-dark-act-red responsive-h4 font-bold"
                            placeholder="Enter your password">Your password *</label>
                        <input id="password" type="password"
                            class="py-1 px-3 bg-transparent border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-black">
                    </div>
                </div>
                <div class="mt-5">
                    <button aria-label="Delete account" type="" class="py-2 px-3 bg-black text-white rounded-md w-auto ">{{ ctaBtnText }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    description: string,
    ctaBtnText: { type: string, required: true }
}>();
</script>