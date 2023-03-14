<template>
    <div></div>
    <div
        class="error relative w-max mt-[10%] mx-auto items-center flex-nowrap container flex max-sm:flex-col space-x-5 max-sm:space-x-0 max-sm:space-y-10 text-gray-200">

        <div class="text-[150px] max-sm:text-[100px] font-black font-['Copperplate_Gothic_Light']">{{ error.statusCode }}
        </div>
        <div class="bg-gray-400 w-[2px] h-[200px] max-sm:w-[200px] max-sm:h-[2px]"></div>
        <div class="flex flex-col space-y-2 relative flex-wrap">
            <div class="text-[20px] font-['Copperplate_Gothic_Light'] max-sm:mt-4">Oops, something went wrong </div>
            <div @click="displayError = true"
                class="hover:cursor-pointer max-sm:text-center text-gray-400 text-[14px] font-['Copperplate_Gothic_Light']">
                Display error message </div>

        </div>

        <div
            class="ml-auto font-['Copperplate_Gothic_Light'] bg-gray-800 p-2 max-sm:p-5 max-sm:text-[24px]  fixed max-sm:relative max-sm:mx-auto max-sm:mt-3 max-sm:rounded-lg hover:rounded-lg top-0 right-0 hover:cursor-pointer rounded-l-md hover:text-orange-500 shadow hover:bg-gray-900">
            <NuxtLink href="/" class=""> Go back </NuxtLink>
        </div>
    </div>
    <Transition name="error-display" type="animation">
        <div class="text-gray-200 mt-10 flex justify-center break-all max-w-[200px] mx-auto text-center"
            v-if="displayError">{{
                error.message
            }}</div>
    </Transition>
</template>

<script setup>
defineProps(['error'])
const backButton = useState('backButton', () => false)
const displayError = useState('displayError', () => false)

</script>

<style scoped>
.error {
    animation: error 1s forwards
}


.shadow:hover {
    animation: shadowFlame 1s infinite alternate, appear 1s forwards
}

.error-display-enter-active {
    animation: errorMessage 500ms forwards
}

@keyframes appear {
    from {
        opacity: 0.5
    }

    to {
        opacity: 1
    }

}

@keyframes shadowFlame {
    from {
        box-shadow: 0 1px 10px 0 orange, 0 1px 10px 0 orange
    }

    to {
        box-shadow: 0 1px 15px 0 orange, 0 1px 15px 0 orange
    }
}

@keyframes error {
    from {
        margin-top: 0;
        opacity: 0;
        filter: blur(1em);
        transform: scale(0);
    }

    to {
        margin-top: 10%;
        opacity: 1;
        filter: blur(0);
        transform: scale(1);
    }
}

@keyframes errorMessage {
    from {

        opacity: 0;
        filter: blur(1em);
        transform: scale(0);
    }

    to {

        opacity: 1;
        filter: blur(0);
        transform: scale(1);
    }
}
</style>