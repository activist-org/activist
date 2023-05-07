<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1 class="p-4 text-light-text dark:text-dark-text">
      Welcome to the help page prototype
      <a href ="https://activist.org/en/help/faq/" style ="color:#FFFFFF;"> FAQ</a> <br>
      <a href ="https://activist.org/en/help/contact/" style ="color:#FFFFFF;">Contact</a> <br>
      <a href ="https://activist.org/en/help/press/" style ="color:#FFFFFF;">Press</a> <br>
      <a href ="https://activist.org/en/help/status/" style ="color:#FFFFFF;">Status</a>
    </h1>
  </div>
</template>

<script setup>
const title = ref("Help");
</script>
