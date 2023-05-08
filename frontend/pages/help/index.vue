<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1 class="p-4 text-light-text dark:text-dark-text">
      Welcome to the help page prototype <br>
      <a href ="https://activist.org/en/help/faq/" style ="color:##0000EE;"><u>FAQ</u></a> <br>
      <a href ="https://activist.org/en/help/contact/" style ="color:##0000EE;"><u>Contact</u></a> <br>
      <a href ="https://activist.org/en/help/press/" style ="color:##0000EE;"><u>Press</u></a> <br>
      <a href ="https://activist.org/en/help/status/" style ="color:##0000EE;"><u>Status</u></a>
    </h1>
  </div>
</template>

<script setup>
const title = ref("Help");
</script>
