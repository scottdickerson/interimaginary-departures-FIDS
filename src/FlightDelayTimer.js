import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./FlightDelayTimer.module.css";

const propTypes = {
  // callback to trigger when the input is changed
  onChange: PropTypes.func.isRequired,
  defaultDelay: PropTypes.number
};

const FlightDelayTimer = ({ onChange, defaultDelay }) => {
  // how many minutes should I delay
  const [delayTimer, setDelayTimer] = useState(defaultDelay);
  return (
    <input
      className={styles.timer}
      type="text"
      value={delayTimer}
      onChange={evt => {
        const {
          target: { value }
        } = evt;
        setDelayTimer(value);
        if (!Number.isNaN(value) && value > 0) {
          onChange(parseFloat(value));
        }
      }}
    ></input>
  );
};

FlightDelayTimer.propTypes = propTypes;
FlightDelayTimer.defaultProps = {
  defaultDelay: 3
};
export default FlightDelayTimer;
