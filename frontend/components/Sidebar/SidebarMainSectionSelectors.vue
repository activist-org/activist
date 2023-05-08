<template>
    <div class="flex flex-col justify-center mx-2 transition-all duration-500">
      <div class="space-y-1 bg-light-header rounded-md p-1 dark:bg-dark-header">
        <MenuSelector
          :selected="false"
          iconURL="bi:calendar-check"
          btnText="Events"
          btnURL="/"
        ></MenuSelector>
        <MenuSelector
          :selected="false"
          iconURL="bi:person-square"
          btnText="Organizations"
          btnURL="/"
        ></MenuSelector>
       
      </div>
    </div>

    <div class="relative basis-full p-2 flex justify-center items-center w-full text-sm text-left transition duration-200 rounded-md font-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight focus-brand"
    :class="{
      'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
        selected == true,
      'text-light-text dark:text-dark-text': selected == false,
    }">
          
          <img src="bi:layout-text-sidebar-reverse" alt="Documentation">;
          <a href ="https://activist.org/en/docs/" style ="color:#0000EE;">Documentation</a>
        </div>
    
</template>
