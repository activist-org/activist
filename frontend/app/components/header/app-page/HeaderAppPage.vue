  <!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
  <template>
    <PageBreadcrumbs class="mt-4 hidden md:block" />
    <div
      v-if="underDevelopment"
      class="mt-5 flex w-full flex-wrap rounded-md border border-primary-text bg-warn-yellow/40 px-3 py-1 text-primary-text dark:border-warn-yellow dark:bg-warn-yellow/30 dark:text-warn-yellow"
    >
      <div class="flex space-x-3">
        <p>🚧</p>
        <div class="flex flex-col space-y-1"> 
          <p>{{ $t("i18n.components.header_app_page.under_development") }}</p>
          <div class="flex space-x-3">
            <a
              class="link-text flex items-center space-x-1 focus-brand"
              href="https://github.com/activist-org/activist"
              target="_blank"
            >
              <p>{{ $t("i18n.components._global.github") }}</p>
              <Icon
                class="mb-1"
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            <p>•</p>
            <a
              class="link-text flex items-center space-x-1 focus-brand"
              href="https://matrix.to/#/#activist_community:matrix.org"
              target="_blank"
            >
              <p>{{ $t("i18n.components._global.matrix") }}</p>
              <Icon
                class="mb-1"
                :name="IconMap.EXTERNAL_LINK"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div id="home-header" class="flex items-baseline pt-4">
    <h1 class="text-left">
      {{ headerName }}
    </h1>
  </div>

  <div class="flex flex-col items-start space-y-4 pt-2">
    <h4 v-if="statusPending" class="warn-text">
      {{ $t("i18n.components.header_app_page.status_pending") }}
    </h4>
    <h4 v-else-if="headerTagline" class="distinct-text text-left">
      {{ headerTagline }}
    </h4>
    
    <div class="w-full">
      <slot />
    </div>
  </div>

  </template>

  <script setup lang="ts">
  const props = defineProps<{
    header?: string;
    tagline?: string;
    underDevelopment?: boolean;
    statusPending?: boolean;
  }>();

  const headerName = computed<string>(() => {
    if (props.header) {
      return props.header;
    } else {
      return "";
    }
  });

  const headerTagline = computed(() => {
    if (props.tagline) {
      return props.tagline;
    } else {
      return "";
    }
  });
  </script>
