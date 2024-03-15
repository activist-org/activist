<template>
    <div class='relative'>
        <ModalBase>
            <template #normalDisplay>
                <button class="absolute left-0 w-10em h-10em">
                    <Icon name="ic:outline-fullscreen" />                
                </button>
                <MediaImageCarousel :class="{ 'lg:hidden': textExpanded }" />
            </template>
            <template #modalDisplay>
            </template>
        </ModalBase>
    </div>
</template>

<script setup lang="ts">

</script>