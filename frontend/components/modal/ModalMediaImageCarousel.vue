<template>
    <div class='relative'>
        <ModalBase>
            <template #normalDisplay>
                <button class="absolute right-2 top-2 z-10">
                    <Icon class="w-12 h-12 border-solid border border-white/80 bg-black/80 rounded-lg" name="ic:outline-fullscreen" />                 
                </button>
                <button class="absolute right-2 bottom-2 z-10">
                    <Icon class="w-12 h-12 border-solid border border-white/80 bg-black/80 rounded-lg" name="bi:plus-lg" />                
                </button>
                <MediaImageCarousel :fullscreen='false' :class="{ 'lg:hidden': textExpanded }" />
            </template>
            <template #modalDisplay>
                <MediaImageCarousel :fullscreen='true' :class="{ 'lg:hidden': textExpanded }" />
            </template>
        </ModalBase>
    </div>
</template>

<script setup lang="ts">

</script>