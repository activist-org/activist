// SPDX-License-Identifier: AGPL-3.0-or-later
const useToggle = (initialValue = false) => {
  const state = ref(initialValue);
  const toggle = () => {
    state.value = !state.value;
  };
  return {
    state: readonly(state),
    toggle,
  };
};

export default useToggle;
