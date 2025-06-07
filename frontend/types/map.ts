// SPDX-License-Identifier: AGPL-3.0-or-later
import type { GeoJsonProperties } from "geojson";

import type { Location } from "./content/location";

export enum MapType {
  POINT = "point",
  CLUSTER = "cluster",
}

export enum ColorByEventType {
  ACTION = "#BA3D3B",
  LEARN = "#2176AE",
}

export const colorByType = {
  learn: ColorByEventType.LEARN,
  action: ColorByEventType.ACTION,
};

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
export type PopupContent = HTMLElement;
export interface Pointer {
  id: string;
  location: Location;
  color: string;
  popup?: PopupContent;
}
// PointerCluster is a type of Pointer that represents a cluster of pointers on the map.
export interface PointerCluster extends Pointer {
  createTooltipCluster?: (props: unknown) => PopupContent;
  properties: unknown;
}
export type ClusterSeparationAmount = number;

export type DonutProperties = {
  value: number;
  color: string;
}[];

export interface ClusterProperties {
  getIndividualDonutProps: (values: GeoJsonProperties) => DonutProperties;
  getMultipleDonutProps: (values: GeoJsonProperties) => DonutProperties;
  getPointerColor: (values: GeoJsonProperties) => string;
  cluster: {
    [key: string]: {
      logic: unknown;
      color: string;
    };
  };
}
