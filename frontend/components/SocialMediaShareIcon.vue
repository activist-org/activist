<template>
  <div class="cursor-pointer"
    style="width: 100%; height: 100%; justify-content: flex-start; align-items: center; gap: 12px; display: inline-flex">
    <div style="iconStyle">
      <svg width="32" height="32" viewBox="0 0 16 16" :fill="fillColor" xmlns="http://www.w3.org/2000/svg">
        <path :d="iconPath" />
      </svg>
    </div>
    <div>{{ text }}</div>
  </div>
</template>
  
<script>

const iconStyle = {
  width: '28px', height: '28px', position: 'relative'
};

export default {
  props: {
    iconPath: String,
    fillColor: String,
    text: String,
    onClick: Function,
    iconStyle: iconStyle,
    textStyle: Object,
  }
};
</script>