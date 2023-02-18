import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import CountDown from "./CountDown";

const Draw = () => {
  const { totalPool, ticketsLeft, expiration } = useContext(AppContext);

  return (
    <div>
      <div className="p-5 flex-1 md:p-10 rounded border">
        <h2 className="font-bold text-xl mb-6">Draw Ends in</h2>
        <div className="flex space-x-6">
          <div className="border flex-1 flex flex-col justify-between rounded py-4 px-2">
            <p className="text-sm md:text-base font-medium">Total Pool</p>
            <p className="text-lg font-bold">{totalPool.toString()}</p>
          </div>
          <div className="border flex-1 flex flex-col justify-between rounded py-4 px-2">
            <p className="text-sm md:text-base font-medium">
              Tickets Remaining
            </p>
            <p className="text-lg font-bold">{ticketsLeft.toString()}</p>
          </div>
        </div>
        <CountDown />
      </div>
    </div>
  );
};

export default Draw;
