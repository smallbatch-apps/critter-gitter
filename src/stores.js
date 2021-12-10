import { writable } from "svelte/store";

const locations = JSON.parse(localStorage.getItem("locations")) || [];
export const locationStore = writable(locations);

let name = "default";
let timeZone = (new Date().getTimezoneOffset() / 60) * -1;
let hemisphere = "north";

const defaultActiveLocation = JSON.parse(
  localStorage.getItem("activeLocation")
) || {
  name,
  timeZone,
  hemisphere,
};

export const activeLocation = writable(defaultActiveLocation);

export const page = writable("home");
