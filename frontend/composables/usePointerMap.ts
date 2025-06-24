// SPDX-License-Identifier: AGPL-3.0-or-later

import type MapLibreGlDirections from "@maplibre/maplibre-gl-directions";

import { layersFactory } from "@maplibre/maplibre-gl-directions";
import maplibregl from "maplibre-gl";

import type { RouteProfile, Pointer } from "~/types/map";

import { useRouting } from "./useRoutingMap";

export const usePointerMap = () => {
  const {
    addDirectionsLayer,
    setSelectedRoute,
    resetDirectionsControl,
    setDirections,
    setMap,
    setMarker,
  } = useRouting();
  const createPointerMarker = (
    pointer: Pointer,
    directions: MapLibreGlDirections | undefined = undefined
  ) => {
    const marker = new maplibregl.Marker({
      color: pointer.color,
    });
    marker.getElement().id = `pointer-${pointer.id}`;
    marker.addClassName("cursor-pointer");
    marker.setLngLat([
      parseFloat(pointer.location.lon),
      parseFloat(pointer.location.lat),
    ]);
    if (pointer.popup) {
      const popup = new maplibregl.Popup({
        offset: 25,
        maxWidth: "260px",
      }).setDOMContent(pointer.popup);
      marker.setPopup(popup);
    }
    if (directions) {
      directions.interactive = true;
      marker.getElement().addEventListener("mouseenter", () => {
        directions.interactive = false;
      });

      marker.getElement().addEventListener("mouseleave", () => {
        directions.interactive = true;
      });
    }
    return marker;
  };

  const createMapForPointerTypeMap = (
    map: maplibregl.Map,
    pointer: Pointer,
    isTouchDevice: boolean
  ) => {
    map.fitBounds(
      [
        [
          parseFloat(pointer.location.bbox[2]),
          parseFloat(pointer.location.bbox[0]),
        ],
        [
          parseFloat(pointer.location.bbox[3]),
          parseFloat(pointer.location.bbox[1]),
        ],
      ],
      {
        duration: 0,
        padding: 120,
      }
    );

    const selectedRoute = setSelectedRoute();
    map.on("load", () => {
      const layers = layersFactory(
        isTouchDevice ? 1.5 : 1,
        isTouchDevice ? 2 : 1
      );
      // Add arrow to directions layer.
      const directions = addDirectionsLayer(
        map,
        layers,
        selectedRoute as RouteProfile
      );
      setDirections(directions);
      const marker = createPointerMarker(pointer, directions).addTo(map);
      setMap(map);
      setMarker(marker);
      resetDirectionsControl();
      map.on("click", () => {
        resetDirectionsControl();
      });
    });
  };

  return {
    createPointerMarker,
    createMapForPointerTypeMap,
  };
};
export default usePointerMap;
