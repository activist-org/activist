<template>
  <ModalBase>
    <template #normalDisplay>
      <slot name="normalDisplay" />
    </template>
    <template #modalDisplay>
      <div>
        <img v-if="previewImage" :src="previewImage" class="uploading-image" alt="preview image"/>
        <label for="upload-image" class="font-bold responsive-h4">Upload Image</label>
        <input @change="uploadImage" id="upload-image" type="file" accept="image/jpeg">
        <button v-if="previewImage" @click="saveImage" class="bg-primary rounded-lg p-2">Save</button>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModalBase from '~/components/modal/ModalBase.vue';

const previewImage = ref();
const uploadImage = (e: Event) => {
  const image = (e.target as HTMLInputElement)?.files?.[0];
  const reader = new FileReader();
  if (image) {
    reader.readAsDataURL(image);
  }
  reader.onload = (e) => {
    if (e.target) {
      previewImage.value = e.target.result;
    }
  };
};
const saveImage = () => {
  console.log('save image', previewImage.value);
}
</script>