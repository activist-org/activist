// SPDX-License-Identifier: AGPL-3.0-or-later
export enum EntityType {
  ORGANIZATION = "organization",
  GROUP = "group",
  EVENT = "event",
}

export type InitialEntity<T> = Partial<Omit<T, "id">> & { id: string };
