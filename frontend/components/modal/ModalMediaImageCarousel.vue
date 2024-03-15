<template>
    <div class='relative'>
        <ModalBase>
            <template #normalDisplay>
                <button class="absolute right-0 top-0 z-10">
                    <Icon class="w-12 h-12" name="ic:outline-fullscreen" />                
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