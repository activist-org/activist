<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <component :is="computedTag" :class="typographyClasses" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "body-sm"
    | "body-lg"
    | "caption"
    | "overline"
    | "subtitle"
    | "link";
  color?:
    | "primary"
    | "primary-over-layer-2"
    | "distinct"
    | "distinct-over-layer-2"
    | "link"
    | "error"
    | "cta"
    | "learn"
    | "action"
    | "warn"
    | "accepted"
    | string;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
  weight?:
    | "thin"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  font?: "display" | "text";
  align?: "left" | "center" | "right" | "justify";
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  truncate?: boolean;
  tag?: string;
}

// Default is body, which assigns a <p> tag.
const props = withDefaults(defineProps<Props>(), {});

// Define component name for debugging.
defineOptions({
  name: "Typography",
});

const typographyClasses = computed(() => {
  const classes: string[] = [];

  // A variant must be provided for each Typography component.
  const variantClasses = {
    h1: "responsive-h1 pt-4 font-bold transition-all duration-500",
    h2: "responsive-h2 font-semibold",
    h3: "responsive-h3 font-semibold",
    h4: "responsive-h4 transition-all duration-500",
    h5: "responsive-h5 font-semibold",
    h6: "text-base font-medium font-display",
    body: "text-base font-normal leading-normal",
    "body-sm": "text-sm font-normal leading-relaxed",
    "body-lg": "text-lg font-normal leading-relaxed",
    caption: "text-sm font-normal leading-tight",
    overline: "text-xs font-medium leading-tight uppercase tracking-wide",
    subtitle: "text-lg font-medium leading-normal",
    link: "link-text font-medium",
  };

  classes.push(variantClasses[props.variant]);

  // Override text color based on the provided color or variant props.
  if (props.color) {
    const colorMap = {
      primary: "text-primary-text",
      "primary-over-layer-2": "text-primary-text-over-layer-2",
      distinct: "text-distinct-text",
      "distinct-over-layer-2": "text-distinct-text-over-layer-2",
      link: "text-link-text hover:text-link-text-hover",
      error: "error-text",
      cta: "text-cta-orange",
      learn: "text-learn-blue",
      action: "text-action-red",
      warn: "text-warn-yellow",
      accepted: "text-accepted-green",
    };

    classes.push(
      colorMap[props.color as keyof typeof colorMap] || `text-${props.color}`
    );
  } else {
    if (props.variant === "caption" || props.variant === "overline") {
      classes.push("text-distinct-text");
    } else if (props.variant === "subtitle") {
      classes.push("text-primary-text");
    } else {
      classes.push("text-primary-text");
    }
  }

  // Override custom size if provided.
  if (props.size) {
    classes.push(`text-${props.size}`);
  }

  // Override custom weight if provided.
  if (props.weight) {
    classes.push(`font-${props.weight}`);
  }

  // Override with custom font if provided or apply default.
  if (props.font === "display") {
    classes.push("font-display");
  } else {
    classes.push("font-text");
  }

  // Override custom alignment if provided.
  if (props.align) {
    classes.push(`text-${props.align}`);
  }

  // Add text transformations if provided.
  if (props.uppercase) classes.push("uppercase");
  if (props.lowercase) classes.push("lowercase");
  if (props.capitalize) classes.push("capitalize");

  // Add text truncation if provided.
  if (props.truncate) {
    classes.push("truncate");
  }

  return classes.join(" ");
});

// Determine the HTML tag based on variant or explicit tag prop.
const computedTag = computed(() => {
  if (props.tag) return props.tag;

  const tagMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    body: "p",
    "body-sm": "p",
    "body-lg": "p",
    caption: "span",
    overline: "span",
    subtitle: "p",
    link: "a",
  };

  return tagMap[props.variant] || "p";
});
</script>
