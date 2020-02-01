import React from "react";
import FlightDelayTimer from "../FlightDelayTimer";
import { action } from "@storybook/addon-actions";
import { number, withKnobs } from "@storybook/addon-knobs";

export default {
  title: "Flight Delay Timer",
  decorators: [withKnobs]
};

export const flightDelayTimer = () => (
  <FlightDelayTimer delay={number("delay", 3)} onChange={action("onChange")} />
);
