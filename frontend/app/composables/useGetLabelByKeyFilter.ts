// SPDX-License-Identifier: AGPL-3.0-or-later
export const useGetLabelByKeyFilter = () => {
  const { $countryName } = useNuxtApp();
  const { t } = useI18n();

  const keyLabel: Record<string, (value: unknown) => string> = {
    topics: (value: unknown) => {
      const v = String(value);
      return GLOBAL_TOPICS.find((topic) => topic.topic === v)?.label ?? v;
    },
    country: (value: unknown) => {
      const v = String(value);
      return $countryName(v) || v;
    },
    city: (value: unknown) => String(value),
    type: (value: unknown) =>
      String(value) === "action"
        ? t("i18n._global.action")
        : t("i18n._global.learn"),
    name: (value: unknown) => String(value),
    locationType: (value: unknown) =>
      String(value) === "online"
        ? t("i18n.composables.use_get_label_by_key_filter.location_type_online")
        : t(
            "i18n.composables.use_get_label_by_key_filter.location_type_physical"
          ),
    days_ahead: (value: unknown) =>
      t("i18n.composables.use_get_label_by_key_filter.next_days", {
        value: Number(value),
      }),
    location: (value: unknown) => String(value),
  };

  const getLabelByKey = (key: string, value: unknown): string => {
    return keyLabel[key]?.(value) ?? String(value);
  };

  return { getLabelByKey };
};
