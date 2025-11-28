// SPDX-License-Identifier: AGPL-3.0-or-later
// MARK: Main Table

export interface PhysicalLocation {
  id: string;
  lat: string;
  lon: string;
  bbox: string[];
  displayName: string;
}

// MARK: Pinia Responses

export interface PiniaResLocation {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: PhysicalLocation;
  _value: PhysicalLocation;
}

export interface PiniaResLocations {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: PhysicalLocation[];
  _value: PhysicalLocation[];
}
