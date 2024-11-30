import 'vue'

export { }

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string) => string;
  }
}
