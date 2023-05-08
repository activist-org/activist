<template>
  <div class="text-light-text dark:text-dark-text">
    <Head>
      <Title>{{ docs }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <div class="grid w-10/12 grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center space-y-4 text-left md:items-start">
          <!-- Note: image floating right of content. -->
          <h1 class="pb-2 font-semibold responsive-text-4">
            Documentation links
          </h1>
          <p>
          Get active <a href="https://activist.org/en/docs/get-active/" style="color:##0000EE;"><u>here</u></a> <br>
          Get organized <a href="https://activist.org/en/docs/get-organized/" style="color:##0000EE;"><u>here</u></a> <br>
          Grow your organization <a href="https://activist.org/en/docs/grow-organization/" style="color:##0000EE;"><u>here</u></a> <br>
          Check out our network <a href="https://activist.org/en/docs/our-network/" style="color:##0000EE;"><u>here</u></a> <br>
          See our roadmap <a href="https://activist.org/en/docs/roadmap/" style="color:##0000EE;"><u>here</u></a> <br>
          </p>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Documentation");
</script>
