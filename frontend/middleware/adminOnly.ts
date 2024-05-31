export default defineNuxtRouteMiddleware(async () => {
  const { roles } = useUser();

  if (!roles.includes("admin")) {
    return alert("Hey! No!");
  }
});
