// SPDX-License-Identifier: AGPL-3.0-or-later
// MARK: Main Table

export interface PhysicalLocation {
  id: string;
  lat: string;
  lon: string;
  bbox: string[];
  addressOrName: string;
  city: string;
  countryCode: string;
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

export interface FormDataLocation {
  country: string;
  street: string;
  city: string;
}
export interface NomatimLocation {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}
