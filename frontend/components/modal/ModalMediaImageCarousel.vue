<template>
    <div class='relative'>
        <!-- Media carousel displayed by default -->
        <MediaImageCarousel :fullscreen='false' :class="{ 'lg:hidden': textExpanded }" />

        <!-- Placeholder add button -->
        <button class="absolute right-2 bottom-2 z-10">
            <Icon class="w-12 h-12 border-solid border border-white border-opacity-80 bg-black bg-opacity-80 rounded-lg" name="bi:plus-lg" />                
        </button>

        <!-- ModalBase component -->
        <ModalBase>
            <!-- Normal display slot -->
            <template #normalDisplay>
                <button class="absolute right-2 top-2 z-10">
                    <Icon class="w-12 h-12 border-solid border border-white border-opacity-80 bg-black bg-opacity-80 rounded-lg" name="ic:outline-fullscreen" />                 
                </button>
            </template>

            <!-- Modal display slot -->
            <template #modalDisplay>
                <MediaImageCarousel :fullscreen='true' :class="{ 'lg:hidden': textExpanded }" />
            </template>
        </ModalBase>
    </div>
</template>

<script setup lang="ts">

</script>