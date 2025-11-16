// SPDX-License-Identifier: AGPL-3.0-or-later
import type { PhysicalLocation } from "~/shared/types/content/location";

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
  location: PhysicalLocation;
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
