<template>
  <div class="page-filter">
    <!-- Title Slot -->
    <slot name="title">
      <h2 class="filter-title">{{ defaultTitle }}</h2>
    </slot>

    <!-- Location Filter -->
    <div class="filter-section">
      <h3>Location</h3>
      <input type="text" placeholder="Filter by location" class="filter-input" />
    </div>

    <!-- Topics Filter -->
    <div class="filter-section">
      <h3>Topics</h3>
      <div class="filter-topics">
        <!-- Render each topic as a tag -->
        <div v-for="(topic, index) in topics" :key="index" class="topic-tag">
          {{ topic }}
          <button @click="removeTopic(index)" class="remove-topic-btn">×</button>
        </div>
        <input type="text"
               v-model="newTopic"
               placeholder="Add another..."
               class="filter-input"
               @keyup.enter="addTopic" />
      </div>
    </div>

    <!-- Custom Controls Slot -->
    <slot name="controls"></slot>
  </div>
</template>

<script>
  export default {
    name: 'PageFilter',
    props: {
      defaultTitle: {
        type: String,
        default: 'Filters',
      },
      showSearch: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        topics: ['Topic Name', 'Topic Name'], // Example topics
        newTopic: '',
      };
    },
    methods: {
      addTopic() {
        if (this.newTopic.trim()) {
          this.topics.push(this.newTopic.trim());
          this.newTopic = '';
        }
      },
      removeTopic(index) {
        this.topics.splice(index, 1);
      },
    },
  };
</script>

<style scoped>
  .page-filter {
    padding: 1rem;
    background-color: #f4f4f4;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .filter-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .filter-section {
    margin-bottom: 1rem;
  }

  .filter-input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .filter-topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5
  }
</style>
