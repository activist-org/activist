<template>
  <!-- Use PageFilter as the base structure -->
  <PageFilter :showSearch="true" defaultTitle="Event Filters">
    <template #controls>
      <!-- Add custom controls for filtering events -->
      <div>
        <input type="text" placeholder="Filter by event name..." />
        <!-- Add more controls, like dropdowns, date pickers, etc. -->
      </div>
    </template>
  </PageFilter>
</template>

<script>
import PageFilter from './PageFilter.vue';

export default {
  name: 'PageFilterEvents',
  components: {
    PageFilter,
  },
};
</script>
