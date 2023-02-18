import { BigNumber, ethers } from "ethers";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { convertToEth, mulBig } from "../utils/convert";

const BuyTickets = () => {
  const [ticketCount, setTicketCount] = useState(1);

  const { ticketPrice, enterDraw } = useContext(AppContext);

  return (
    <div className="p-4 border rounded flex-[0.75] h-fit">
      <div className="flex justify-between">
        <p className="font-semibold">Price per Ticket</p>
        <p className="font-semibold">{`${convertToEth(ticketPrice)} ETH`}</p>
      </div>
      <input
        onChange={(e) => {
          if (e.target.value) setTicketCount(e.target.value);
          else setTicketCount(0);
        }}
        className="my-4"
        type={"number"}
      />
      <div className="flex flex-col space-y-2 text-sm font-semibold">
        <div className="flex justify-between">
          <p>Total costs of Tickets</p>
          <p>{`${ethers.utils.formatEther(
            BigNumber.from(ticketPrice)?.mul(ticketCount)
          )} ETH`}</p>
        </div>
        <div className="flex justify-between">
          <p>Service Fees</p>
          <p>0.001 ETH</p>
        </div>
        <div className="flex justify-between">
          <p>* Network Fees</p>
          <p>T & C</p>
        </div>
      </div>
      <button
        onClick={() => enterDraw(ticketCount)}
        className="btn mt-6 w-full"
      >{`Buy ${ticketCount} Ticket(s) for ${ethers.utils.formatEther(
        BigNumber.from(ticketPrice)?.mul(ticketCount)
      )} ETH`}</button>
    </div>
  );
};

export default BuyTickets;
