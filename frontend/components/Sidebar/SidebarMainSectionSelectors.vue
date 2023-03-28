<template>
  <div
    class="flex flex-col p-1 mx-2 space-y-1 rounded-md bg-light-header dark:bg-dark-header transition-all duration-500"
  >
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
</template>
