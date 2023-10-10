<template>
  <div class="px-4 sm:px-6 md:px-8 lg:px-10 py-5 card-style flex flex-col items-center max-w-[274px] max-h[138px] justify-center">
    <div class="mb-5">
      <span class="mx-auto text-lg text-center font-semibold">
        {{ $t("components.tooltip-sign-in.tooltip-text") }}
      </span>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w[274px]">
      <BtnLabeled
       class="flex items-center justify-center truncate max-h-[40px]"
        label= "components.tooltip-sign-in.sign-in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        ariaLabel="SignIn"
      />
      <BtnLabeled
        class="flex items-center justify-center truncate max-h-[40px]"
        label= "components.tooltip-sign-in.sign-up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        ariaLabel="SignUp"
      />
    </div>
  </div>
</template>
