declare module "vue" {
  interface ComponentCustomProperties {
    $t: (key: string) => string;
  }
}
