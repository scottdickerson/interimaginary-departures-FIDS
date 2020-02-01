import wistful from "../imgs/Wistful.png";
import quantum from "../imgs/Quantum.png";
export const flights = [
  {
    status: "On Time",
    carrier: wistful,
    departureTime: 1575826200000,
    destination: "Anarres",
    details: [
      {
        name: "Transport",
        value: "Hainish spaceship"
      },
      {
        name: "Distance",
        value: "Eleven years at light speed"
      },
      {
        name: "Weather",
        value: "Dry, cold, and windy"
      },
      {
        name: "Atmosphere",
        value: "Thin"
      }
    ]
  },
  {
    status: "Canceled",
    carrier: quantum,
    departureTime: 1575829800000,
    destination: "Arrakis",
    details: [
      {
        name: "Transport",
        value: "Spacing Guild Liner"
      },
      {
        name: "Duration of trip",
        value: "Instantaneous"
      },
      {
        name: "Weather",
        value: "No precipitation, no water"
      },
      {
        name: "Environment",
        value: "A wasteland of nothing but spice and sandworms"
      }
    ]
  },
  {
    status: "On Time",
    carrier: wistful,
    departureTime: 1575833400000,
    destination: "Brigadoon",
    details: [
      {
        name: "Transport",
        value: "A well-organized miracle"
      },
      {
        name: "Distance from Austin",
        value: "4,602 miles"
      },
      {
        name: "Duration of trip",
        value: "One hundred years"
      },
      {
        name: "Atmosphere",
        value: "Highland mist blooming under sable skies"
      }
    ]
  }
];
