import { ethers } from "ethers";

export const returnTicketPrice = async (contract) => {
  let ticketPrice = await contract.getTicketPrice();
  return ticketPrice;
};

export const returnTicketsRemaining = async (contract) => {
  let ticketsRemaining = await contract.remainingTickets();
  return ticketsRemaining;
};

export const returnSaleExpiry = async (contract) => {
  let saleExpiry = await contract.getExpiration();
  return saleExpiry ? saleExpiry.toNumber() * 1000 : Date.now();
};

export const returnPrizePool = async (contract, ticketPrice) => {
  let tickets = await contract.getTickets();
  return ethers.utils.formatEther(
    ethers.BigNumber.from(tickets.length).mul(ticketPrice)
  );
};
export const returnRecentWinner = async (contract) => {
  let recentWinner = await contract.getRecentWinner();
  return recentWinner;
};

export const returnWinnerAmount = async (contract, addr) => {
  let amount = await contract.getWinnerAmount(addr);
  console.log(amount.toString());
  return amount;
};
