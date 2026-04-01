<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MetaTag
    :iconName="IconMap.PEOPLE"
    :label="label"
    :value="`${categorizeNumber(members)}`"
  />
</template>

<script setup lang="ts">
defineProps<{
  members: number;
  label?: string;
  iconSize?: string;
}>();

/**
 * Categorizes a given number into predefined ranges. This function takes a number as input and categorizes it into specific ranges for display purposes. If the number is less than 10, it returns "<10". For numbers 10 and above, it calculates the lower and upper bounds of the range (e.g., "10-20", "20-30", etc.) and returns a string representing that range. This categorization is useful for displaying member counts or other numerical data in a more user-friendly format, especially when dealing with larger numbers.
 * @param num The number to be categorized. This is typically a count of members or similar numerical data that needs to be displayed in a more readable format. The function processes this number to determine the appropriate category or range it falls into, allowing for a clearer and more concise representation of the data in the user interface.
 * @returns A string representing the categorized range of the input number. If the number is less than 10, it returns "<10". For numbers 10 and above, it returns a range string (e.g., "10-20").
 */
function categorizeNumber(num: number): string {
  if (num < 10) {
    return "<10";
  } else {
    const lowerBound = Math.floor(num / 10) * 10;
    const upperBound = lowerBound + 10;
    return `${lowerBound}-${upperBound}`;
  }
}
</script>
