<template>
  <Tooltip
    header="Restricted content"
    :text="$t('components.tooltip-sign-in.text')"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-max">
      <BtnLabeled
        class="flex items-center justify-center truncate max-h-[40px]"
        label="components.btn-labeled.sign-in"
        linkTo="/auth/sign-in"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.sign-in-aria-label')"
      />
      <BtnLabeled
        class="flex items-center justify-center truncate max-h-[40px]"
        label="components.btn-labeled.sign-up"
        linkTo="/auth/sign-up"
        :cta="true"
        fontSize="lg"
        :ariaLabel="$t('components.btn-labeled.sign-up-aria-label')"
      />
    </div>
  </Tooltip>
</template>
