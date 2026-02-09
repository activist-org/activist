import type { OrganizationFilters, Organization } from '~/types';

interface OrganizationsResponse {
  results: Organization[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export const useGetOrganizations = (filters: Ref<OrganizationFilters>) => {
  const organizations = ref<Organization[]>([]);
  const pending = ref(false);
  const page = ref(1);
  const pageSize = 10;
  const hasMore = ref(true);
  const config = useRuntimeConfig();

  const fetchOrganizations = async (reset = false) => {
    if (!reset && (!hasMore.value || pending.value)) return;

    if (reset) {
      page.value = 1;
      organizations.value = [];
      hasMore.value = true;
    }

    pending.value = true;

    try {
      const params: Record<string, any> = {
        page_size: pageSize,
      };

      if (page.value > 1) params.page = page.value;

      if (filters.value.topics && filters.value.topics.length > 0) {
        params.topics = filters.value.topics.join(',');
      }

      if (filters.value.status) {
        params.status = filters.value.status;
      }

      // Only add search if it has actual content
      if (filters.value.search && filters.value.search.trim()) {
        params.search = filters.value.search.trim();
      }

      console.log('🔍 Fetching organizations...');
      console.log('📋 Filters:', filters.value);
      console.log('📤 API Params:', params);

      const response = await $fetch<OrganizationsResponse>(
        `${config.public.apiBase}/v1/communities/organizations/`, 
        {
          query: params,
        }
      );
      
      const newOrgs = response.results || [];
      
      console.log(`✅ Received ${newOrgs.length} organizations`);
      
      if (reset) {
        organizations.value = newOrgs;
      } else {
        organizations.value.push(...newOrgs);
      }

      hasMore.value = !!response.next && newOrgs.length === pageSize;
      if (hasMore.value) {
        page.value++;
      }
      
    } catch (error: any) {
      console.error('❌ Fetch failed:', error.response?._data || error.message);
      hasMore.value = false;
    } finally {
      pending.value = false;
    }
  };

  watch(
    () => JSON.stringify(filters.value),
    () => {
      console.log('🔄 Filters changed, refetching...');
      fetchOrganizations(true);
    },
    { immediate: true }
  );

  const getMore = async () => {
    await fetchOrganizations(false);
  };

  return {
    data: organizations,
    pending,
    getMore,
  };
};