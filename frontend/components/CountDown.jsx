import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const CountDown = () => {
  const [active, setActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { expiration } = useContext(AppContext);
  const getTimeRemaining = (e) => {
    const total = e - Date.parse(new Date());
    if (total >= 0) {
      console.log(total);
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / 1000 / 60 / 60) % 24);
      setTimeRemaining({
        hours,
        seconds,
        minutes,
      });
    }
  };
  console.log(expiration);
  useEffect(() => {
    let timer = setInterval(() => getTimeRemaining(expiration), 1000);

    return () => {
      clearInterval(timer);
      console.log(timer, "clearing");
    };
  }, [expiration, timeRemaining]);
  return (
    <div className="grid grid-cols-3 gap-x-3 md:gap-x-6 mt-6">
      <div className="text-center p-2 md:p-4 border rounded">
        <p className="font-bold text-2xl md:text-4xl">
          {timeRemaining.hours.toString().padStart(2, "0")}
        </p>
        <p className="text-[10px] font-semibold md:text-sm">Hours</p>
      </div>
      <div className="text-center p-2 md:p-4 border rounded">
        <p className="font-bold text-2xl md:text-4xl">
          {timeRemaining.minutes.toString().padStart(2, "0")}
        </p>
        <p className="text-[10px] font-semibold md:text-sm">Minutes</p>
      </div>
      <div className="text-center p-2 md:p-4 border rounded">
        <p className="font-bold text-2xl md:text-4xl">
          {timeRemaining.seconds.toString().padStart(2, "0")}
        </p>

        <p className="text-[10px] font-semibold md:text-sm">Seconds</p>
      </div>
    </div>
  );
};

export default CountDown;
