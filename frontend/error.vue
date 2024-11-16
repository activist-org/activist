<template>
  <HeaderWebsite />
  <div class="flex h-full bg-brand">
    <Head>
      <Title>{{ $t("error.title") }}</Title>
    </Head>
    <div
      class="container relative mx-auto my-[10%] flex flex-col items-center justify-center space-y-10 text-center md:flex-row md:space-x-8 md:space-y-0 md:text-left xl:space-x-12"
    >
      <!-- Error Code -->
      <div class="error-code">
        {{ error.statusCode || $t("error.default_status") }}
      </div>
      
      <!-- Separator -->
      <div class="separator"></div>
      
      <!-- Error Message Section -->
      <div class="error-message">
        <div class="message-text">
          {{ $t("error.message") }}
        </div>
        <div class="details">
          {{ error.message || $t("error.default_message") }}
        </div>
        
        <!-- Return Home Button -->
        <BtnRouteInternal
          :cta="true"
          label="_global.return_home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="_global.return_home_aria_label"
        />
      </div>
    </div>
  </div>
  <FooterWebsite />
</template>

<script setup lang="ts">
class HTTPError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

defineProps<{
  error: HTTPError;
}>();
</script>

<style scoped>
.error-code {
  @apply flex flex-wrap font-['Copperplate_Gothic_Light'] text-[125px] font-black text-brand-text md:text-[175px] lg:text-[200px];
}

.separator {
  @apply h-[2px] w-[120px] bg-brand-secondary md:h-[200px] md:w-[2px];
}

.error-message {
  @apply flex max-w-[350px] flex-col items-center text-left md:items-start;
}

.message-text {
  @apply mt-4 text-lg text-brand-text md:mt-0 md:text-xl;
}

.details {
  @apply my-8 text-brand-secondary md:my-6 md:text-lg;
}
</style>
