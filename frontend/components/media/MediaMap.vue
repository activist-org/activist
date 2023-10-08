<template>
  <div class="map card-style">
    <div
      class="w-full h-full select-none saturate-[1.15] dark:hue-rotate-180 dark:invert"
      id="map-div"
      ref="map"
      :alt="$t('img-alt-text')"
    ></div>
    <div
      class="flex flex-col items-center justify-center h-full px-5 pb-5 text-2xl text-center space-y-5 text-light-cta-orange dark:text-dark-cta-orange"
      :class="{ hidden: !errorOccurred }"
      :key="rerenderKey"
    >
      <p>{{ $t("error-message") }}</p>
      <p>{{ $t("sorry-message") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import l, { mapoptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ref } from "vue";

const props = defineProps<{
  addresses: string[];
  title: string;
  type: string;
}>();
const localePath = useLocalePath();

const rerenderKey = ref(0);
const map = ref();

type marker = {
  address: string;
  lat: number;
  lon: number;
};

let errorOccurred: boolean = false;

function handleMapError(error: error) {
  console.error(error);
  errorOccurred = true;

  // todo: more helpful and better looking error messages.
  rerenderKey.value += 1; // rerender the error div
  map.value.style.opacity = 0;
  map.value.style.position = "absolute";
}

function drawMap(avgLat: number, avgLon: number, markers: array<marker>) {
  let mapOptions: mapoptions = {
    center: [avgLat, avgLon],
    zoom: 13,
    attributionControl: false,
  };

  let leafletMap = l.map("map-div", mapOptions);

  let layer = new l.tilelayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  leafletMap.addLayer(layer);

  const colorMode = useColorMode();
  let eventColor = "";
  if (props.type === "act") {
    if (colorMode.value == "dark") {
      eventColor = "#dd7e6b";
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
  border: 1px solid #d8dee4`;

  const mapIcon = l.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${markerHTMLStyles}" />`,
  });

  markers.map((marker: marker) => {
    let pin = l.marker([marker.lat, marker.lon], { icon: mapIcon });
    // add location pin to map.
    pin.addTo(leafletMap);
    pin.on("click", function () {
      l.popup()
        .setLatLng(pin.getLatLng())
        .setContent(
          `
          <div class="flex bg-[#f6f8fa] rounded-lg">
            <div class="flex flex-col w-3/5 px-2 pt-1 pb-2 space-y-1">
              <p class="text-sm font-bold">${props.title}</p>
              <p class="text-xs font-semibold">date and time</p>
              <p class="text-xs font-semibold">${marker.address}</p>
              <a href="/home" class="attend-btn py-[0.5rem] px-[1.125rem] bg-[#f1993d] text-[#f6f8fa] font-medium rounded-md w-fit">
                attend
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
    note: below is an example of the code to use when the backend code
    is up and running, removing most of the logic from the frontend.

    const props = defineProps<{
        locations: array<marker>,
        averageLat: number,
        averageLon: number
    }>();

    onMounted(() => {
        drawMap(props.averageLat, props.averageLon, props.locations);
    });
*/

onMounted(() => {
  let markers: array<marker> = [];
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
          handleMapError(new error("osm: provided address not found."));
          return;
        }

        const latitude = data[0].lat;
        const longitude = data[0].lon;

        markers[index] = { address: address, lat: latitude, lon: longitude };
        averageLat += +latitude;
        averageLon += +longitude;

        if (index == props.addresses.length - 1) {
          // calculate  averages for centerpoint of map.
          averageLat /= props.addresses.length;
          averageLon /= props.addresses.length;
          drawMap(averageLat, averageLon, markers);
        }
      })
      .catch((error: error) => {
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
