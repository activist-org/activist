<template>
  <div
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-3 md:grid-rows-1 lg:gap-12"
  >
    <ImageLogo
      imageName="WikimediaDE"
      imageLink="https://www.wikimedia.de"
      :aria-label="
        $t('components.grid-supporters.wikimedia-de-logo-aria-label')
      "
    />
    <ImageLogo
      imageName="WikimediaRS"
      imageLink="https://wikimedia.rs"
      :aria-label="
        $t('components.grid-supporters.wikimedia-rs-logo-aria-label')
      "
    />
    <ImageLogo
      imageName="ImpactHub"
      imageLink="https://belgrade.impacthub.net"
      :aria-label="
        $t('components.grid-supporters.impact-hub-belgrade-logo-aria-label')
      "
    />
  </div>
</template>
