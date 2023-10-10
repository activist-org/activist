<template>
  <div
    class="flex items-center pl-[12px] pr-[10px] py-2 max-h-[40px] space-x-2 text-left border rounded select-none border-light-interactive dark:border-dark-interactive text-light-special-text dark:text-dark-special-text"
  >
    <input
      class="w-full h-5 bg-transparent outline-none placeholder:text-light-special-text dark:placeholder:text-dark-special-text"
      @input="updateValue"
      :id="uuid"
      :value="modelValue"
      :placeholder="placeholder"
      :type="refInputType"
    />
    <span v-for="(icon, index) in iconsNames" :key="index" class="cursor-pointer" @click="handleIconClick(icon)">
      <Icon :name="icon" size="1.5em" :color="getIconColor(icon)" />
    </span>
    <!-- <span v-if="isIconVisible" @click="changeInputType" class="cursor-pointer">
      <Icon name="mdi:eye" size="28px" />
    </span> -->
  </div>
</template>

<script setup lang="ts">
import useFormInput from "../../composables/useFormSetup";
import useUniqueID from "../../composables/useUniqueID";

export interface Props {
  placeholder?: string;
  modelValue?: string;
  inputType?: string;
  isIconVisible?: boolean;
  iconsNames?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  modelValue: "",
  inputType: "text",
  isIconVisible: false,
  iconsNames: [],
});

const emit = defineEmits(["update:modelValue"]);

const { updateValue } = useFormInput({ value: props?.modelValue }, emit, false);

const uuid = useUniqueID().getID();

const refInputType = ref(props?.inputType);

const changeInputType = () => {
  refInputType.value = refInputType.value === "password" ? "text" : "password";
};

const handleIconClick = (iconName) => {
  if (iconName === 'bi:eye-fill') {
    changeInputType(); // Alterna o tipo de entrada
  }
};

const getIconColor = (iconName) => {
  if (iconName === 'bi:check-lg') {
    return "#3BA55C"
  } else if (iconName === 'bi:x-lg') {
    return "#BA3D3B"
  } else {
    return "#5A5A5A"
  }
}

</script>
