<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<script setup lang="ts">
const route = useRoute();
const { status } = await useAsyncData(
  async () =>
    await fetchWithoutToken(
      `/auth/verify_email/${route.params.code}`,
      {},
      "POST"
    )
);
if (status.value === "success") {
  await useRouter().push("/auth/sign-in");
} else {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await useRouter().push("/auth/sign-in");
}
</script>
