<template>
    <div>
        <div class="error relative w-36 h-6 max-md:m-2 m-5 max-md:mx-auto max-md:w-28">
            <LogosActivist class="absolute inset-0 flex justify-center items-center z-1" />
        </div>
        <div
            class="error  relative mt-[10%] mx-auto items-center justify-center max-md:text-center container flex max-md:flex-col space-x-5 max-md:space-x-0 max-md:space-y-10 text-gray-200">
            <div
                class="text-[150px] text-light-text dark:text-dark-text max-md:text-[100px] max-md:break-all flex flex-wrap font-black font-['Copperplate_Gothic_Light']">
                {{
                    error.statusCode
                }}
            </div>
            <div class="bg-gray-400 w-[2px] h-[200px] max-md:w-[120px] max-md:h-[2px]"></div>
            <div class="text-center relative flex flex-col justify-center items-center max-w-[350px]">
                <div
                    class="text-[20px] text-light-text dark:text-dark-text font-['Copperplate_Gothic_Light'] max-md:mt-4  flex flex-wrap mx-auto">
                    Oops,
                    something went
                    wrong </div>
                <div
                    class="text-light-text dark:text-dark-text mt-4 max-md:mt-10 break-all flex flex-wrap justify-center p-2">
                    {{
                        error.message
                    }}</div>
                <NuxtLink href="/"
                    class="px-4 py-2 font-medium text-center border rounded-md select-none xl:rounded-lg text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct focus-brand bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-light active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-light dark:active:bg-dark-cta-orange ml-auto p-2  transition-all max-md:text-[24px]  max-md:absolute max-md:relative max-md:mx-auto rounded-md hover:rounded-lg mt-4">
                    Go back </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['error'])
</script>

<style scoped>
.error {
    animation: error 1s forwards
}

@keyframes error {
    from {
        filter: blur(0.5em);
    }

    to {
        filter: blur(0);
    }
}
</style>