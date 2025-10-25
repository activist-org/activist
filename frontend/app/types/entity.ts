// SPDX-License-Identifier: AGPL-3.0-or-later

import type { User } from "./auth/user";

export enum EntityType {
  ORGANIZATION = "organization",
  GROUP = "group",
  EVENT = "event",
}

export type InitialEntity<T> = Partial<Omit<T, "id">> & { id: string };

export interface Entity {
  id: string;
  name: string;
  createdBy: User | string;
  creationDate?: string;
}
