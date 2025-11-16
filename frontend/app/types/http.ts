// SPDX-License-Identifier: AGPL-3.0-or-later

import type { FetchOptions } from "ofetch";

export type ServiceOptions = Omit<FetchOptions, "method"> & {
  withoutAuth?: boolean;
};
export type ServiceOptionsWithBody = Omit<FetchOptions, "method" | "body"> & {
  withoutAuth?: boolean;
};
export type AcceptedBody =
  | Record<string, unknown>
  | FormData
  | BodyInit
  | null
  | undefined
  | object;
export interface Pagination {
  page: number;
  page_size: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  isLastPage: boolean;
}
