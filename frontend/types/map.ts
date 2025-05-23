// SPDX-License-Identifier: AGPL-3.0-or-later

export enum MapType {
  MARK = "mark",
  CLUSTER = "cluster",
}

export enum ColorByEventType {
  ACTION = "#BA3D3B",
  LEARN = "#2176AE",
}

export interface RouteProfile {
  profile: string;
  api: string;
}

export interface RouteProfileOption {
  FOOT: string;
  BIKE: string;
  DRIVING: string;
  CAR: string;
}
