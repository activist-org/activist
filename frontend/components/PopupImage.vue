<template>
    <div
    id="popup" 
    class="fixed top-0 z-10 flex flex-col items-center hidden w-full h-screen overflow-hidden cursor-pointer bg-light-popup dark:bg-dark-popup">
        <div id="popup-header" class="flex flex-row items-end justify-end w-full">
        </div>
        <div class="flex flex-col items-center justify-center w-4/5 p-4">
            
            <Icon 
            name="bi:x-circle-fill" 
            class="self-end w-4 h-4 light-highlight dark:dark-highlight"/>
            <img 
            id="popup-image"
            src=""
            alt="Mockups that show mobile organization search and web event search on a map." 
            class="object-contain p-4"
            />
        </div>
    </div>
</template>
<script>
export default {}
</script>