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
    <MenuSelector
          :selected="false"
          iconURL="bi:layout-text-sidebar-reverse"
          btnText="Documentation"
          btnURL="/docs"
        ></MenuSelector>
</template>
