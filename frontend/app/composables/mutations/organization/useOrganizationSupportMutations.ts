// SPDX-License-Identifier: AGPL-3.0-or-later

export function useOrganizationSupportMutations(
  orgId: MaybeRef<string>,
  options: OptionMutation = {}
) {
  const organization = computed(() => unref(orgId));
  const { invalidateOrganizationCache, getKeyForOrganization } =
    useOrganizationCache();
  const { invalidateUserCache } = useUserCache();
  const { handleError } = useAppError();
  const queryCache = useQueryCache();
  const { mutate: createSupport, isLoading: loadingCreateSupport } =
    useMutation({
      ...options.create,
      mutation: async (supporterType: "user" | "org") => {
        if (!organization.value) return null;
        return createOrganizationSupport(organization.value, supporterType);
      },
      onMutate(vars: "user" | "org") {
        const key = getKeyForOrganization(organization.value);
        const previousOrganization = queryCache.getQueryData<Organization>(key);
        if (previousOrganization) {
          if (vars === "user") {
            previousOrganization.supporterUserCount =
              (previousOrganization.supporterUserCount ?? 0) + 1;
            previousOrganization.isSupportedByUser = true;
          } else if (vars === "org") {
            previousOrganization.supporterOrgCount =
              (previousOrganization.supporterOrgCount ?? 0) + 1;
          }
          queryCache.setQueryData(key, {
            ...previousOrganization,
          });
        }
        return { previousOrganization };
      },
      onError(err, _orderedFaqs, context) {
        if (context?.previousOrganization) {
          queryCache.setQueryData(
            getKeyForOrganization(organization.value),
            context.previousOrganization
          );
        }
        handleError(err);
      },
      async onSuccess() {
        await invalidateOrganizationCache(organization.value);
        await invalidateUserCache();
      },
    });
  const { mutate: deleteSupport, isLoading: loadingDeleteSupport } =
    useMutation({
      ...options.delete,
      mutation: async () => {
        if (!organization.value) return null;
        return deleteOrganizationSupport(organization.value);
      },
      onMutate(vars: "user" | "org") {
        const key = getKeyForOrganization(organization.value);
        const previousOrganization = queryCache.getQueryData<Organization>(key);
        if (previousOrganization) {
          if (vars === "user") {
            previousOrganization.supporterUserCount =
              (previousOrganization.supporterUserCount ?? 0) - 1;
          } else if (vars === "org") {
            previousOrganization.supporterOrgCount =
              (previousOrganization.supporterOrgCount ?? 0) - 1;
            previousOrganization.isSupportedByUser = false;
          }
          queryCache.setQueryData(key, {
            ...previousOrganization,
          });
        }
        return { previousOrganization };
      },
      onError(err, _orderedFaqs, context) {
        if (context?.previousOrganization) {
          queryCache.setQueryData(
            getKeyForOrganization(organization.value),
            context.previousOrganization
          );
        }
        handleError(err);
      },
      async onSuccess() {
        await invalidateOrganizationCache(organization.value);
        await invalidateUserCache();
      },
    });

  const loading = computed(() => loadingCreateSupport || loadingDeleteSupport);

  return {
    createSupport,
    deleteSupport,
    loading: readonly(loading),
  };
}
