<template>
    <div
    id="popup" 
    class="fixed hidden flex flex-col top-0 items-center w-full h-screen z-10 overflow-hidden bg-white/85 dark:bg-black/85">
        <div id="popup-header" class="flex flex-row items-end w-full justify-end">
        </div>
        <div class="w-4/5 flex p-4 flex-col justify-center items-center">
            <label class="px-4 py-2 font-medium text-center border select-none rounded-md xl:rounded-lg text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct focus-brand bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-light dark:hover:bg-dark-cta-orange-light text-sm hidden lg:block cursor-pointer self-end">⨯</label>
            <img 
            id="popup-image"
            src=""
            alt="Mockups that show mobile organization search and web event search on a map." 
            class="p-4 object-contain"
            />
        </div>
    </div>
</template>
<script>
export default {}
</script>