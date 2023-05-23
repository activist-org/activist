<template>
  <div class="flex w-96 h-96 rounded-lg map border p-0 m-auto">
    <div
      id="map-div"
      class="w-full h-full z-0 rounded-lg"
      ref="map"
      alt="Map displaying a pin at the location of this organisation or event."
    ></div>

    <p
      class="text-2xl text-center z-10 m-auto align-middle p-5 text-light-cta-orange dark:text-dark-cta-orange"
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
import { ref } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const props = defineProps<{
  addresses: Array<string>;
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
  };

  let leafletMap: L.map = new L.map("map-div", mapOptions);

  let layer = new L.TileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  leafletMap.addLayer(layer);
  markers.map((marker: Marker) => {
    let pin = L.marker([marker.lat, marker.lon], { title: marker.address }); // add location pin to map
    pin.addTo(leafletMap);
  });
}

/*
    NOTE: Below is an exmaple of the code to use when the backend code 
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
      "http://nominatim.openstreetmap.org/search?q=" +
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
          averageLat /= props.addresses.length; // calculate  averages for centerpoint of map
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