// SPDX-License-Identifier: AGPL-3.0-or-later
export interface Filter {
  title: string;
  name: string;
  type: "radio" | "checkbox" | "search";
  items: CheckboxOption[];
  style?: string;
  allowCustomValue?: boolean;
  pageType?: string[];
  searchInput?: boolean;
  placeholder: string;
  expandable?: boolean;
  reveal?: boolean;
}

export interface Filters {
  [key: string]: Filter;
}
