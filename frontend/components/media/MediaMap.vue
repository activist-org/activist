<template>
  <div class="map card-style">
    <div
      ref="map"
      id="map-div"
      class="w-full h-full select-none saturate-[1.15] dark:hue-rotate-180 dark:invert rounded-md sm:rounded-lg"
      :alt="$t('components.media-map.img-alt-text')"
    ></div>
    <div
      :key="rerenderKey"
      class="flex flex-col items-center justify-center h-full px-5 pb-5 text-2xl text-center space-y-5 text-light-cta-orange dark:text-dark-cta-orange"
      :class="{ hidden: !errorOccurred }"
    >
      <p>{{ $t("components.media-map.error-message") }}</p>
      <p>{{ $t("components.media-map.sorry-message") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import L, { MapOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, ref } from "vue";

const props = defineProps<{
  addresses: string[];
  title: string;
  type: string;
}>();

const rerenderKey = ref(0);
const map = ref();

type Marker = {
  address: string;
  lat: number;
  lon: number;
};

let errorOccurred: boolean = false;

function handleMapError(error: Error) {
  console.error(error);
  errorOccurred = true;

  // TODO: More helpful and better looking error messages.
  rerenderKey.value += 1; // rerender the error div
  map.value.style.opacity = 0;
  map.value.style.position = "absolute";
}

function drawMap(avgLat: number, avgLon: number, markers: Marker[]) {
  const mapOptions: MapOptions = {
    center: [avgLat, avgLon],
    zoom: 13,
    attributionControl: false,
  };

  const leafletMap = L.map("map-div", mapOptions);

  const layer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  leafletMap.addLayer(layer);

  const colorMode = useColorMode();
  let eventColor = "";
  if (props.type === "action") {
    if (colorMode.value == "dark") {
      eventColor = "#DD7E6B";
    } else {
      eventColor = "#9A031E";
    }
  } else {
    if (colorMode.value == "dark") {
      eventColor = "#6D9EEB";
    } else {
      eventColor = "#006DAA";
    }
  }

  const markerHTMLStyles = `
  background-color: ${eventColor};
  width: 2rem;
  height: 2rem;
  display: block;
  left: -1rem;
  top: -1.5rem;
  position: relative;
  border-radius: 2rem 2rem 0;
  transform: rotate(45deg);
  border: 1px solid #D8DEE4`;

  const mapIcon = L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${markerHTMLStyles}" />`,
  });

  markers.map((marker: Marker) => {
    const pin = L.marker([marker.lat, marker.lon], { icon: mapIcon });
    // Add location pin to map.
    pin.addTo(leafletMap);
    pin.on("click", function () {
      L.popup()
        .setLatLng(pin.getLatLng())
        .setContent(
          `
          <div class="flex bg-[#F6F8FA] rounded-lg">
            <div class="flex flex-col w-3/5 px-2 pt-1 pb-2 space-y-1">
              <p class="text-sm font-bold">${props.title}</p>
              <p class="text-xs font-semibold">Date and time</p>
              <p class="text-xs font-semibold">${marker.address}</p>
              <a href="/home" class="attend-btn py-[0.5rem] px-[1.125rem] bg-[#F1993D] text-[#F6F8FA] font-medium rounded-md w-fit">
                Attend
              </a>
            </div>
            <div class="w-2/5 border-l-[24px] border-[#9A031E] bg-[#898688] rounded-r-md">
              <img src=""/>
            </div>
          </div>
        `
        )
        .openOn(leafletMap);
    });
  });
}

/*
    NOTE: Below is an example of the code to use when the backend code
    is up and running, removing most of the logic from the frontend.

    const props = defineProps<{
        locations: Marker[],
        averageLat: number,
        averageLon: number
    }>();

    onMounted(() => {
        drawMap(props.averageLat, props.averageLon, props.locations);
    });
*/

onMounted(() => {
  const markers: Marker[] = [];
  let averageLat: number = 0;
  let averageLon: number = 0;

  props.addresses.forEach((address: string, index: number) => {
    const formattedAddress = address.replace(/ /g, "+"); // replace spaces with +

    const osmURL =
      "https://nominatim.openstreetmap.org/search?q=" +
      formattedAddress +
      "&format=json";

    fetch(osmURL) // get the latitude and longitude of the address
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 0) {
          handleMapError(new Error("OSM: Provided address not found."));
          return;
        }

        const latitude = data[0].lat;
        const longitude = data[0].lon;

        markers[index] = { address: address, lat: latitude, lon: longitude };
        averageLat += +latitude;
        averageLon += +longitude;

        if (index == props.addresses.length - 1) {
          // Calculate  averages for centerpoint of map.
          averageLat /= props.addresses.length;
          averageLon /= props.addresses.length;
          drawMap(averageLat, averageLon, markers);
        }
      })
      .catch((error: Error) => {
        handleMapError(error);
      });
  });
});
</script>

<style>
.leaflet-container a.leaflet-popup-close-button {
  color: #f6f8fa;
}

.leaflet-container a.attend-btn {
  color: #f6f8fa;
}

.leaflet-container p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.leaflet-popup-content-wrapper {
  border-radius: 5px;
}

.leaflet-popup-content {
  margin: 0rem;
  width: 100%;
  height: 100%;
}
</style>
