<template>
  <div class="text-light-text dark:text-dark-text">
    <Head>
      <Title>{{ help }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <div class="grid w-10/12 grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center space-y-4 text-left md:items-start">
          <!-- Note: image floating right of content. -->
          <h1 class="pb-2 font-semibold responsive-text-4">
            Get help
          </h1>
          <p>Frequently asked questions 
          <a href="https://activist.org/en/help/faq/" style="color:##0000EE;"><u>here</u></a> <br>
          Want to contact our team? Try  <a href="https://activist.org/en/help/Contact/" style="color:##0000EE;"><u>here</u></a> <br>
          Contact our press? Try  <a href="https://activist.org/en/help/press/" style="color:##0000EE;"><u>here</u></a> <br>
          Check the status of our server <a href="https://activist.org/en/help/status/" style="color:##0000EE;"><u>here</u></a>
          </p>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Help");
</script>
