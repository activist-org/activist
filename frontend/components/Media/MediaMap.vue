<template>
  <div
    class="w-full h-full border rounded-sm bg-clip-content map border-light-section-div dark:border-dark-section-div sm:rounded-md"
  >
    <div
      id="map-div"
      class="z-0 w-full h-full rounded-sm sm:rounded-md"
      ref="map"
      alt="Map displaying a pin at the location of this event."
    ></div>

    <p
      class="z-10 p-5 m-auto text-2xl text-center align-middle text-light-cta-orange dark:text-dark-cta-orange"
      :class="{
        absolute: !errorOccurred,
      }"
      :key="rerenderKey"
    >
      {{ errorMessage }}
      <br />
      {{ sorryMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ref } from "vue";

const props = defineProps<{
  addresses: Array<string>;
  type: string;
}>();
const localePath = useLocalePath();

const rerenderKey = ref(0);
const map = ref();

type Marker = {
  address: string;
  lat: number;
  lon: number;
};

let errorOccurred: boolean = false;
let errorMessage: string;
let sorryMessage: string;

function handleMapError(error: Error) {
  console.error(error);
  errorOccurred = true;

  // TODO: More helpful and better looking error messages
  errorMessage = "There was a problem with the map service.";
  sorryMessage = "Sorry about that!";
  rerenderKey.value += 1; // rerender the error div
  map.value.style.opacity = 0;
  map.value.style.position = "absolute";
}

function drawMap(avgLat: number, avgLon: number, markers: Array<Marker>) {
  let mapOptions = {
    center: [avgLat, avgLon],
    zoom: 13,
    attributionControl: false,
  };

  let leafletMap: L.map = new L.map("map-div", mapOptions);

  let layer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  leafletMap.addLayer(layer);

  let eventColor = "";
  if (props.type === "act") {
    eventColor = "#9A031E";
  } else {
    eventColor = "#006DAA";
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
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHTMLStyles}" />`,
  });

  markers.map((marker: Marker) => {
    let pin = L.marker(
      [marker.lat, marker.lon],
      { icon: mapIcon },
      {
        title: marker.address,
      }
    );
    pin.addTo(leafletMap); // add location pin to map
  });
}

/*
    NOTE: Below is an example of the code to use when the backend code
    is up and running, removing most of the logic from the frontend.

    const props = defineProps<{
        locations: Array<Marker>,
        averageLat: number,
        averageLon: number
    }>();

    onMounted(() => {
        drawMap(props.averageLat, props.averageLon, props.locations);
    });
*/

onMounted(() => {
  let markers: Array<Marker> = [];
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
