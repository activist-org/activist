<template>
    <div class="flex flex-col w-full md:flex-row">
        <div class="flex-col pt-3 space-y-3 md:pl-4 lg:pl-6 md:space-y-4 md:grow md:pt-0">
            <div class="flex flex-col justify-between md:flex-row">
                <div class="flex items-center justify-center space-x-2 md:space-x-4">
                    <div class="w-min md:w-min">
                        <BtnLabeled class="w-small flex mt-1" :cta="true" linkTo="/" :label="discussionInput.write"
                            fontSize="sm" iconSize="1.25em"
                            ariaLabel="components.btn-labeled.support-organization-aria-label" />
                    </div>
                    <div class="w-min md:w-min">
                        <BtnLabeled class="w-small flex mt-1" :cta="true" linkTo="/" :label="discussionInput.preview"
                            fontSize="sm" iconSize="1.25em"
                            ariaLabel="components.btn-labeled.support-organization-aria-label" />
                    </div>
                </div>
                <div class="flex items-center w-full mt-2 space-x-1 md:flex-row md:w-fit lg:space-x-3 ">
                    <Icon class="cursor-pointer" name="bi:at" size="1.75em" @click="at()" />

                    <Icon class="cursor-pointer" name="bi:h-square" size="1.5em" @click="heading()" />

                    <Icon class="cursor-pointer" name="bi:type-bold" size="1.75em" @click="bold()" />

                    <Icon class="cursor-pointer" name="bi:type-italic" size="1.75em" @click="italic()" />

                    <Icon class="cursor-pointer" name="bi:blockquote-left" size="1.75em" @click="blockquote()" />

                    <Icon class="cursor-pointer" name="bi:link-45deg" size="1.75em" @click="link()" />

                    <Icon class="cursor-pointer" name="bi:paperclip" size="1.75em" @click="attach()" />

                    <Icon class="cursor-pointer" name="bi:list-ul" size="1.75em" @click="listul()" />

                    <Icon class="cursor-pointer" name="bi:list-ol" size="1.75em" @click="listol()" />

                </div>
            </div>

            <div class="w-full md:w-full">
                <textarea id="message" rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Leave a comment"></textarea>

            </div>
            
                <div class="flex items-center justify-between px-1 ">
                
                <p class="inline-flex items-center  px-4 ">This editor supports markdown<a href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax" target="_blank"><Icon class="mx-1" name="bi:markdown" size="1.25em"></Icon></a></p>
                <div class="flex pl-0 space-x-1 sm:pl-2">
                    <BtnLabeled class="inline-flex justify-center items-center  w-small " :cta="true" linkTo="/" label="Comment" fontSize="sm"
                        iconSize="1.25em" ariaLabel="components.btn-labeled.support-organization-aria-label" />
                </div>
            </div>

 

        </div>

    </div> 
</template>


  
<script setup lang="ts">
import type { DiscussionInput } from '~/types/discussionInput';

defineProps<{
    isPrivate?: boolean;
    discussionInput: DiscussionInput;
}>();

const at = () => {
    console.log("click on at")
}

const heading = () => {
    console.log("click on heading")
}

const bold = () => {
    console.log("click on bold")
}

const italic = () => {
    console.log("click on italic")
}

const blockquote = () => {
    console.log("click on blockquote")
}

const link = () => {
    console.log("click on link")
}

const attach = () => {
    console.log("click on attach")
}

const listul = () => {
    console.log("click on listul")
}

const listol = () => {
    console.log("click on listol")
}
</script>


  