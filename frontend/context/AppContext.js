import { ethers } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import { abi, contractAddress } from "../utils/constants";
import { isAdmin, returnComissionEarned } from "./admin";
import {
  returnPrizePool,
  returnTicketPrice,
  returnTicketsRemaining,
  returnSaleExpiry,
  returnRecentWinner,
  returnWinnerAmount,
} from "./user";

export const AppContext = createContext();

const { ethereum } = typeof window !== "undefined" ? window : {};

const POSSIBLE_ERRORS = [
  "You are not a lottery operator",
  "Lottery expired",
  "Invalid number of tickets",
  "Draw is active",
  "Not enough ticket price",
  "Number of tickets exceeds maximum ticket",
  "No tickets purchased",
  "You are not a winner",
  "Transfer Failed",
  "No commission available",
  "Lottery not expired yet",
];
const createContract = (address) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner(address);
  const lotteryConract = new ethers.Contract(contractAddress, abi, signer);
  return lotteryConract;
};

const AppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [toast, setToast] = useState({ title: "", description: "" });
  const [expiration, setExpiration] = useState();
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [totalPool, setTotalPool] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [adminRefresh, setAdminRefresh] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [comissionEarned, setComissionEarned] = useState(0);
  const [winner, setWinner] = useState(0);
  const [pastWinner, setPastWinner] = useState([]);
  const checkEthereumExists = () => {
    if (!ethereum) {
      setError("Please Install MetaMask.");
      return false;
    }
    return true;
  };
  const getConnectedAccounts = async () => {
    setError("");
    try {
      const accounts = await ethereum.request(
        {
          method: "eth_accounts",
        },
        []
      );
      console.log(accounts);
      setAccount(accounts[0]);
    } catch (err) {
      setError(err.message);
      setToast({ title: "error", description: err.message.split("(")[0] });
    }
  };
  const connectWallet = async () => {
    setError("");
    if (checkEthereumExists()) {
      setBtnLoading(true);
      try {
        const accounts = await ethereum.request(
          {
            method: "eth_requestAccounts",
          },
          []
        );
        console.log(accounts);
        setAccount(accounts[0]);
      } catch (err) {
        setError(err.message);
        setToast({ title: "error", description: err.message.split("(")[0] });
      }
      setBtnLoading(false);
    }
  };

  const checkErrors = (err) => {
    const error = POSSIBLE_ERRORS.find((e) => err.includes(e));
    console.log(error);
    if (error) {
      setToast({
        title: "error",
        description: error,
      });
    }
  };

  const callContract = async (cb) => {
    if (checkEthereumExists() && account) {
      const lotteryContract = createContract(account);
      try {
        await cb(lotteryContract);
      } catch (err) {
        console.log(err);
        checkErrors(err.message);
      }
    } else {
      setToast({
        title: "error",
        description: "Something wrong with contract creation",
      });
    }
  };

  const loadAdmin = async () => {
    await callContract(async function (contract) {
      let _isAdmin = await isAdmin(contract);
      console.log("IsAdmin?", _isAdmin);
      let _comissionEarned;
      if (_isAdmin) {
        _comissionEarned = await returnComissionEarned(contract);
      }
      setAdmin(_isAdmin);
      setComissionEarned(_comissionEarned);
    });
  };

  const loadUser = async () => {
    await callContract(async function (contract) {
      let _ticketPrice = await returnTicketPrice(contract);
      let _ticketsRemaining = await returnTicketsRemaining(contract);
      let _saleExpiry = await returnSaleExpiry(contract);
      let _prizePool;
      if (_ticketPrice) {
        _prizePool = await returnPrizePool(contract, _ticketPrice);
      }
      let _winnerAmount = await returnWinnerAmount(contract, account);
      let _recentWinner = await returnRecentWinner(contract);
      console.log(_recentWinner);
      setTicketPrice(_ticketPrice);
      setTicketsLeft(_ticketsRemaining);
      setExpiration(_saleExpiry);
      setTotalPool(_prizePool);
      setWinner(_winnerAmount);
      setPastWinner(_recentWinner);
    });
  };

  // const getExpiration = async () => {
  //   if (checkEthereumExists()) {
  //     setBtnLoading(true);

  //     try {
  //       const lotteryContract = createContract(account);
  //       let expiration = await lotteryContract.getExpiration();
  //       console.log(expiration.toString());
  //       setExpiration(expiration.toNumber() * 1000);
  //     } catch (err) {
  //       setError(err.message);
  //       setToast({ title: "error", description: err.message.split("(")[0] });

  //       console.log(err);
  //     }
  //     setBtnLoading(false);
  //   }
  // };

  const restartDraw = async () => {
    setBtnLoading(true);
    callContract(async (contract) => {
      let tx = await contract.startDraw();
      await tx.wait();
      setToast({ title: "success", description: "Draw Restarted" });
      setRefresh((prev) => prev + 1);
    });
    setBtnLoading(false);
  };

  const enterDraw = async (noOfTickets) => {
    setBtnLoading(true);
    callContract(async (contract) => {
      let tx = await contract.enterDraw({
        value: ticketPrice.mul(ethers.BigNumber.from(noOfTickets)),
      });
      await tx.wait();
      setRefresh((prev) => prev + 1);
      setToast({
        title: "success",
        description: "Tickets Purchased Sucessfully",
      });
    });
    setBtnLoading(false);
  };

  const drawWinner = async () => {
    setBtnLoading(true);
    callContract(async (contract) => {
      let tx = await contract.drawWinner();
      await tx.wait();
      setRefresh((prev) => prev + 1);
      setAdminRefresh((prev) => prev + 1);
      setToast({
        title: "success",
        description: "Winner Picked Sucessfully",
      });
    });
    setBtnLoading(false);
  };

  const withdrawComission = async () => {
    if (checkEthereumExists()) {
      setBtnLoading(true);
      callContract(async (contract) => {
        let tx = await contract.withdrawCommission();
        await tx.wait();
        setAdminRefresh((prev) => prev + 1);
        setToast({
          title: "success",
          description: "Comission Withdraw Sucessfull",
        });
      });

      setBtnLoading(false);
    }
  };

  const withdrawWinnings = async () => {
    setBtnLoading(true);
    callContract(async (contract) => {
      let tx = await contract.withdrawWinnigs();
      await tx.wait();
      setRefresh((prev) => prev + 1);
      setToast({
        title: "success",
        description: "Withdraw winning balance Sucessfull",
      });
    });

    setBtnLoading(false);
  };

  const refundAll = async () => {
    if (checkEthereumExists()) {
      setBtnLoading(true);
      callContract(async (contract) => {
        let tx = await contract.refundAll();
        await tx.wait();
        setRefresh((prev) => prev + 1);
        setToast({
          title: "success",
          description: "Refund Sucessfull",
        });
      });

      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
    };
  }, []);

  useEffect(() => {
    if (refresh > 0) {
      console.log("loading user");
      loadUser();
    }
  }, [refresh]);

  useEffect(() => {
    if (adminRefresh > 0) {
      loadAdmin();
    }
  }, [adminRefresh]);
  useEffect(() => {
    if (account) {
      loadAdmin();
      loadUser();
    }
  }, [account]);

  return (
    <AppContext.Provider
      value={{
        account,
        connectWallet,
        error,
        toast,
        setToast,
        btnLoading,
        admin,
        expiration,
        enterDraw,
        ticketPrice,
        comissionEarned,
        restartDraw,
        drawWinner,
        winner,
        ticketsLeft,
        totalPool,
        withdrawComission,
        refundAll,
        pastWinner,
        withdrawWinnings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
