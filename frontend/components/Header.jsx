import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { account, connectWallet } = useContext(AppContext);

  return (
    <header className=" border-b">
      <div className="container py-4 max-w-5xl flex items-center justify-between">
        <h1 className="font-bold text-lg sm:text-xl md:text-3xl">
          CWM Lottery
        </h1>

        {account ? (
          <p className="font-semibold text-lg">{`${account.substring(
            0,
            5
          )}..${account.slice(-3)}`}</p>
        ) : (
          <button className="btn bg-amber-200" onClick={connectWallet}>
            Connect
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
