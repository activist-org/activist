<template>
    <div class="flex flex-col w-full md:flex-row">
        <div class="justify-content-centre w-min md:w-min">
            <BtnLabeled class="w-small flex mt-1" :cta="true" linkTo="/" :label="discussion.supporters" fontSize="sm"
                leftIcon="bi:arrow-up" iconSize="1.25em"
                ariaLabel="components.btn-labeled.support-organization-aria-label" />
        </div>
        <div class="flex-col pt-3 space-y-3 md:pl-4 lg:pl-6 md:space-y-4 md:grow md:pt-0">
            <div class="flex flex-col justify-between md:flex-row">
                <div class="flex items-center justify-center space-x-2 md:space-x-4">
                    <h2 class="font-bold responsive-h3">
                        {{ discussion.name }}
                    </h2>
                    <div class="w-min md:w-min">
                        <BtnLabeled class="w-small flex mt-1" :cta="true" linkTo="/" :label="discussion.category"
                            fontSize="sm"  iconSize="1.25em"
                            ariaLabel="components.btn-labeled.support-organization-aria-label" />
                    </div>
                </div>
                <div class="items-center hidden w-full space-x-3 md:flex md:w-fit lg:space-x-5">
                    

                    <MetaTagMembers :members=3 :label="label"/>
                    <MetaTag iconName="bi:chat-left" :value="String(3)" :label="label"/>
                </div>
            </div>
            <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">

                <div class="flex justify-center space-x-3 lg:space-x-4 md:justify-start"> 
                    <a href="/" class="flex items-center">
                        <div
                            class="border rounded-full w-fit border-light-section-div dark:border-dark-section-div bg-light-content dark:bg-dark-content">
                            <Icon name="bi:person" size="1.75em" />
                        </div>
                        <p class="ml-2">Author</p>
                    </a>
                    <div class="ml-2 flex items-center">
                        <MetaTagDate :date="event?.date.toLocaleDateString()" />
                        <p class="mt-0.8 ml-1">Date and Time</p>
                         
                    </div>
                </div>
            </div>
            

        </div>

    </div>
</template>
  
<script setup lang="ts">
import type { discussion } from "../../../types/discussion";

defineProps<{
    isPrivate?: boolean;
    discussion: Discussion;
}>();
</script>
  