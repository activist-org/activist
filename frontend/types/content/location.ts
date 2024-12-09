// MARK: Main Table

export interface Location {
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
  _rawValue: Location;
  _value: Location;
}

export interface PiniaResLocations {
  __v_isShallow: boolean;
  __v_isRef: boolean;
  _rawValue: Location[];
  _value: Location[];
}
