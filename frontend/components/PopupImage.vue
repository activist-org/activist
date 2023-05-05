<template>
    <div
    id="popup" 
    class="fixed hidden flex flex-col top-0 items-center w-full h-screen z-10 overflow-hidden bg-light-popup dark:bg-dark-popup cursor-pointer">
        <div id="popup-header" class="flex flex-row items-end w-full justify-end">
        </div>
        <div class="w-4/5 flex p-4 flex-col justify-center items-center">
            
            <Icon 
            name="bi:x-circle-fill" 
            class="self-end w-4 h-4 light-highlight dark:dark-highlight"/>
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