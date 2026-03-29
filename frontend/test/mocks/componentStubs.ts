// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Shared component stubs for mounting Vue components in tests.
 *
 * These stubs replace real form components with minimal implementations
 * that expose the same props/slots needed by the component under test.
 */

// MARK: Form

export const FormStub = {
  name: "Form",
  props: ["id", "schema", "submitLabel", "actionButtons"],
  emits: ["submit"],
  template:
    '<form data-testid="form" :id="id" @submit.prevent="$emit(\'submit\', {})"><slot v-bind="{ values: {} }" /></form>',
};

// MARK: Form Item

export const FormItemStub = {
  name: "FormItem",
  props: ["label", "name", "required"],
  template:
    '<div class="form-item-stub" data-testid="form-item" :data-name="name" :data-required="required"><slot v-bind="{ id: name, handleChange: () => {}, handleBlur: () => {}, errorMessage: { value: \'\' }, value: { value: \'\' } }" /></div>',
};

// MARK: Text Inputs

export const FormTextInputStub = {
  name: "FormTextInput",
  props: ["id", "hasError", "label", "modelValue"],
  template: '<input data-testid="text-input" :id="id" :value="modelValue" />',
};

export const FormTextAreaStub = {
  name: "FormTextArea",
  props: ["id", "hasError", "value"],
  template: '<textarea data-testid="text-area" :id="id"></textarea>',
};

// MARK: Selectors

export const FormSelectorRadioStub = {
  name: "FormSelectorRadio",
  props: ["id", "modelValue", "options"],
  template: '<div data-testid="radio-selector" :data-id="id"></div>',
};

export const FormSelectorComboboxTopicsStub = {
  name: "FormSelectorComboboxTopics",
  props: ["id", "label", "selectedTopics"],
  template: '<div data-testid="topics-selector"></div>',
};

export const FormSelectorComboboxCountryStub = {
  name: "FormSelectorComboboxCountry",
  props: ["id", "hasError", "label", "selectedCountry"],
  template: '<div data-testid="country-selector"></div>',
};
