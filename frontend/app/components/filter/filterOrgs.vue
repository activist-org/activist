<template>
  <div class="rounded-lg border border-layer-2 bg-layer-1 p-6 shadow-sm">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-text-primary">Filter</h2>
      
      <div class="flex overflow-hidden rounded-md border border-gray-400">
        <button 
          @click="updateStatus('active')"
          :class="status === 'active' ? 'bg-orange-400 text-black' : 'bg-gray-300 text-gray-700'"
          class="px-6 py-2 text-sm font-semibold transition-colors border-r border-gray-400"
        >
          Active
        </button>
        <button 
          @click="updateStatus('new')"
          :class="status === 'new' ? 'bg-orange-400 text-black' : 'bg-gray-300 text-gray-700'"
          class="px-6 py-2 text-sm font-semibold transition-colors border-r border-gray-400"
        >
          New
        </button>
        <button 
          @click="updateStatus('private')"
          :class="status === 'private' ? 'bg-orange-400 text-black' : 'bg-gray-300 text-gray-700'"
          class="px-6 py-2 text-sm font-semibold transition-colors"
        >
          Private
        </button>
      </div>
    </div>

    <div class="relative mb-6">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span class="text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
      <input
        type="text"
        :value="searchQuery"
        @input="e => updateSearch((e.target as HTMLInputElement).value)"
        placeholder="Search to filter"
        class="block w-full rounded-full border border-gray-200 bg-orange-50/30 py-3 pl-10 pr-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
      />
    </div>

    <div>
      <h3 class="mb-3 text-sm font-medium text-text-secondary">Popular tags</h3>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="selectedTopics.includes(tag) ? 'bg-orange-400 text-black border-orange-500' : 'bg-gray-300 text-gray-800 border-gray-400'"
          class="rounded-md border px-4 py-1.5 text-xs font-bold transition-colors"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedTopics: TopicEnum[];
  status?: string;
  searchQuery?: string;
}>();

const emit = defineEmits(['update:selectedTopics', 'update:status', 'update:search']);

const availableTags: TopicEnum[] = Object.values(TopicEnum);

const updateStatus = (newStatus: string) => {
  emit('update:status', newStatus);
};

const updateSearch = (value: string) => {
  emit('update:search', value);
};

const toggleTag = (tag: TopicEnum) => {
  const newSelection = props.selectedTopics.includes(tag)
    ? props.selectedTopics.filter(t => t !== tag)
    : [...props.selectedTopics, tag];
  emit('update:selectedTopics', newSelection);
};
</script>